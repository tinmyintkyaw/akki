import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("file")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("filename", "text", (col) => col.notNull())
    .addColumn("original_filename", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id"),
    )
    .addColumn("organization_id", "uuid", (col) =>
      col.notNull().references("organization.id"),
    )
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("file").ifExists().cascade().execute();
};
