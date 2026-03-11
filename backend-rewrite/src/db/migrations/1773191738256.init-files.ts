import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("file")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("filename", "text", (col) => col.notNull())
    .addColumn("extension", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id"),
    )
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id"),
    )
    .execute();

  await db.schema
    .createIndex("file_space_id_idx")
    .on("file")
    .column("space_id")
    .execute();

  await db.schema
    .createIndex("file_created_by_idx")
    .on("file")
    .column("created_by")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("file").cascade().execute();
};
