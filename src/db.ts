import { createClient, type InStatement } from "@libsql/client";
import type { CompiledDataset } from "./compile.ts";
import { renderBuild, renderIngredient, renderMenuProduct, renderPrep } from "./markdown.ts";
import {
  buildAllergens,
  buildSummary,
  datasetStats,
  ingredientSummary,
  menuSummary,
  parentRef,
  prepSummary,
} from "./summary.ts";

/**
 * Read model for tenon.coffee. The site queries one record (or one small
 * list) per request; nothing ever loads the whole catalogue at runtime.
 *
 *   records  one row per ingredient / prep / build / menu product
 *            body     = the full compiled JSON served at /api/v1/{collection}/{id}.json
 *            markdown = the sheet served at /api/v1/{collection}/{id}.md
 *            summary  = compact JSON for list pages (see summary.ts)
 *   uses     reverse references ("used by"), ordered as in the compiled record
 *   meta     data_version, schema_version, nutrients, stats (JSON values)
 */
export const SCHEMA_SQL = (suffix: string) => [
  `CREATE TABLE records${suffix} (
    ref TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    id TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    vertical TEXT,
    parent_ref TEXT,
    is_chassis INTEGER NOT NULL,
    placeholder INTEGER NOT NULL,
    formats TEXT NOT NULL,
    allergens TEXT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    markdown TEXT NOT NULL
  )`,
  `CREATE TABLE uses${suffix} (
    used_ref TEXT NOT NULL,
    ord INTEGER NOT NULL,
    user_ref TEXT NOT NULL,
    PRIMARY KEY (used_ref, ord)
  )`,
  `CREATE TABLE meta${suffix} (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
];

const INDEX_SQL = [
  "CREATE UNIQUE INDEX IF NOT EXISTS records_kind_id ON records (kind, id)",
  "CREATE INDEX IF NOT EXISTS records_kind_chassis ON records (kind, is_chassis, code)",
  "CREATE INDEX IF NOT EXISTS records_parent ON records (parent_ref)",
];

const roundNumbers = (_key: string, value: unknown) =>
  typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;

export interface RecordRow {
  ref: string;
  kind: string;
  id: string;
  code: string;
  name: string;
  version: string;
  vertical: string | null;
  parent_ref: string | null;
  is_chassis: number;
  placeholder: number;
  formats: string;
  allergens: string;
  summary: string;
  body: string;
  markdown: string;
}

/** Every row the database should contain for this dataset, in a stable order. */
export function* recordRows(data: CompiledDataset): Generator<RecordRow> {
  const buildByRef = new Map(data.builds.map((b) => [b.ref, b]));
  const row = (
    r: { ref: string; id: string; code: string; name: string; version: string },
    kind: string,
    extra: Pick<RecordRow, "vertical" | "parent_ref" | "is_chassis" | "placeholder" | "formats" | "allergens">,
    summary: unknown,
    markdown: string,
  ): RecordRow => ({
    ref: r.ref,
    kind,
    id: r.id,
    code: r.code,
    name: r.name,
    version: r.version,
    ...extra,
    summary: JSON.stringify(summary, roundNumbers),
    body: `${JSON.stringify(r, roundNumbers)}\n`,
    markdown,
  });

  for (const r of data.ingredients) {
    yield row(
      r,
      "ingredient",
      {
        vertical: null,
        parent_ref: null,
        is_chassis: 1,
        placeholder: r.composition.placeholder ? 1 : 0,
        formats: "[]",
        allergens: JSON.stringify(r.composition.allergens),
      },
      ingredientSummary(r),
      renderIngredient(data, r),
    );
  }
  for (const r of data.preps) {
    yield row(
      r,
      "prep",
      {
        vertical: null,
        parent_ref: parentRef(r.derived_from),
        is_chassis: r.derived_from ? 0 : 1,
        placeholder: r.composition.placeholder ? 1 : 0,
        formats: "[]",
        allergens: JSON.stringify(r.composition.allergens),
      },
      prepSummary(r),
      renderPrep(data, r),
    );
  }
  for (const r of data.builds) {
    yield row(
      r,
      "build",
      {
        vertical: r.vertical,
        parent_ref: parentRef(r.derived_from),
        is_chassis: r.derived_from ? 0 : 1,
        placeholder: r.variants.some((v) => v.composition.placeholder) ? 1 : 0,
        formats: JSON.stringify(r.formats),
        allergens: JSON.stringify(buildAllergens(r)),
      },
      buildSummary(r),
      renderBuild(data, r),
    );
  }
  for (const r of data.menu) {
    const build = buildByRef.get(r.build);
    const def = r.variants.find((v) => v.key === r.default_variant) ?? r.variants[0];
    yield row(
      r,
      "menu",
      {
        vertical: build?.vertical ?? null,
        parent_ref: null,
        is_chassis: build?.derived_from ? 0 : 1,
        placeholder: def?.composition.placeholder ? 1 : 0,
        formats: JSON.stringify(r.formats),
        allergens: JSON.stringify(def?.composition.allergens ?? []),
      },
      menuSummary(r, build),
      renderMenuProduct(data, r),
    );
  }
}

export function metaEntries(data: CompiledDataset): [string, unknown][] {
  return [
    ["schema_version", data.schema_version],
    ["data_version", data.data_version],
    ["nutrients", data.nutrients],
    ["stats", datasetStats(data)],
    ["loaded_at", new Date().toISOString()],
  ];
}

const RECORD_COLUMNS = [
  "ref", "kind", "id", "code", "name", "version", "vertical", "parent_ref",
  "is_chassis", "placeholder", "formats", "allergens", "summary", "body", "markdown",
] as const;

/** Keeps each HTTP request to Turso comfortably under its payload limit. */
const MAX_BATCH_BYTES = 4 * 1024 * 1024;
const MAX_BATCH_STATEMENTS = 500;

export interface LoadOptions {
  url: string;
  authToken?: string;
  log?: (msg: string) => void;
}

/**
 * Loads the dataset into staging tables, then swaps them in with one
 * transaction so the site never sees a half-loaded catalogue.
 */
export async function loadDatabase(data: CompiledDataset, { url, authToken, log = console.log }: LoadOptions) {
  const db = createClient({ url, authToken });
  const staging = "_staging";
  try {
    await db.batch(
      [
        `DROP TABLE IF EXISTS records${staging}`,
        `DROP TABLE IF EXISTS uses${staging}`,
        `DROP TABLE IF EXISTS meta${staging}`,
        ...SCHEMA_SQL(staging),
      ],
      "write",
    );

    let pending: InStatement[] = [];
    let pendingBytes = 0;
    let written = 0;
    const flush = async () => {
      if (pending.length === 0) return;
      await db.batch(pending, "write");
      written += pending.length;
      pending = [];
      pendingBytes = 0;
    };
    const push = async (stmt: InStatement, bytes: number) => {
      if (pending.length >= MAX_BATCH_STATEMENTS || (pending.length > 0 && pendingBytes + bytes > MAX_BATCH_BYTES)) {
        await flush();
      }
      pending.push(stmt);
      pendingBytes += bytes;
    };

    const insertRecord = `INSERT INTO records${staging} (${RECORD_COLUMNS.join(", ")}) VALUES (${RECORD_COLUMNS.map(() => "?").join(", ")})`;
    let count = 0;
    for (const row of recordRows(data)) {
      await push(
        { sql: insertRecord, args: RECORD_COLUMNS.map((c) => row[c]) },
        row.body.length + row.markdown.length + row.summary.length + 256,
      );
      count += 1;
      if (count % 5000 === 0) log(`  · ${count} records queued`);
    }

    const insertUse = `INSERT INTO uses${staging} (used_ref, ord, user_ref) VALUES (?, ?, ?)`;
    let uses = 0;
    for (const r of [...data.ingredients, ...data.preps, ...data.builds, ...data.menu]) {
      for (const [ord, user] of r.used_by.entries()) {
        await push({ sql: insertUse, args: [r.ref, ord, user] }, r.ref.length + user.length + 64);
        uses += 1;
      }
    }

    for (const [key, value] of metaEntries(data)) {
      const text = JSON.stringify(value);
      await push({ sql: `INSERT INTO meta${staging} (key, value) VALUES (?, ?)`, args: [key, text] }, text.length + 64);
    }
    await flush();
    log(`  · wrote ${count} records, ${uses} use edges (${written} statements)`);

    await db.batch(
      [
        "DROP TABLE IF EXISTS records",
        "DROP TABLE IF EXISTS uses",
        "DROP TABLE IF EXISTS meta",
        `ALTER TABLE records${staging} RENAME TO records`,
        `ALTER TABLE uses${staging} RENAME TO uses`,
        `ALTER TABLE meta${staging} RENAME TO meta`,
        ...INDEX_SQL,
      ],
      "write",
    );
    log(`✓ database now serves data v${data.data_version}`);
    return { records: count, uses };
  } finally {
    db.close();
  }
}
