import { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("system_settings")
    .addColumn("typesense_search_key", "jsonb")
    .execute();

  await db
    .insertInto("system_settings")
    .values({ id: 1 })
    .executeTakeFirstOrThrow();
};

export const down = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("system_settings")
    .dropColumn("typesense_search_key")
    .execute();
};
