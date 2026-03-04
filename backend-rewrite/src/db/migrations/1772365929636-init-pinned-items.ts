import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("pinned_page")
    .addColumn("page_id", "uuid", (col) =>
      col.notNull().references("page.id").onDelete("cascade"),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint("pinned_page_pk", ["page_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("pinned_page_user_id_idx")
    .on("pinned_page")
    .column("user_id")
    .execute();

  await db.schema
    .createTable("pinned_tag")
    .addColumn("tag_id", "uuid", (col) =>
      col.notNull().references("tag.id").onDelete("cascade"),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint("pinned_tag_pk", ["tag_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("pinned_tag_user_id_idx")
    .on("pinned_tag")
    .column("user_id")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("pinned_page").cascade().execute();
  await db.schema.dropTable("pinned_tag").cascade().execute();
};
