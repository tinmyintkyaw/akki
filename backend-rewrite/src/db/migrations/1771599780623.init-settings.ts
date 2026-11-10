import { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("user_settings")
    .addColumn("user_id", "uuid", (col) =>
      col.primaryKey().references("user.id").onDelete("cascade"),
    )
    .addColumn("settings", "jsonb", (col) => col.notNull().defaultTo("{}"))
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("user_settings").ifExists().execute();
};
