import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("system_settings")
    .addColumn("id", "integer", (col) =>
      col
        .primaryKey()
        .defaultTo(1)
        .check(sql`id = 1`),
    )
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("system_settings").execute();
};
