import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("page")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))

    .addColumn("name", "text", (col) => col.notNull().defaultTo("Untitled"))

    .addColumn("ydoc", "bytea", (col) => col.notNull())

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )

    .addColumn("deleted_at", "timestamptz", (col) => col.defaultTo(null))

    .addColumn("is_pinned", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("author_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )

    .addColumn("organization_id", "uuid", (col) =>
      col.notNull().references("organization.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("tag")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("organization_id", "uuid", (col) =>
      col.notNull().references("organization.id").onDelete("cascade"),
    )

    .addColumn("name", "text", (col) => col.notNull())

    .addUniqueConstraint("unique_space_tag", ["organization_id", "name"])
    .execute();

  await db.schema
    .createTable("page_tag")
    .addColumn("page_id", "uuid", (col) =>
      col.notNull().references("page.id").onDelete("cascade"),
    )
    .addColumn("tag_id", "uuid", (col) =>
      col.notNull().references("tag.id").onDelete("cascade"),
    )

    .addPrimaryKeyConstraint("page_tag_pk", ["page_id", "tag_id"])
    .execute();

  await db.schema
    .createIndex("idx_page_active")
    .on("page")
    .columns(["organization_id", "updated_at desc"])
    .where(sql.ref("deleted_at"), "is", null)
    .execute();

  await db.schema
    .createIndex("idx_page_trashbin")
    .on("page")
    .columns(["organization_id", "deleted_at desc"])
    .where(sql.ref("deleted_at"), "is not", null)
    .execute();

  await db.schema
    .createIndex("idx_tags_org")
    .ifNotExists()
    .on("tag")
    .columns(["organization_id"])
    .execute();

  await db.schema
    .createIndex("idx_page_tag_tag_id")
    .on("page_tag")
    .column("tag_id")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("page").ifExists().cascade().execute();
  await db.schema.dropTable("tag").ifExists().cascade().execute();
  await db.schema.dropTable("page_tag").ifExists().cascade().execute();
  await db.schema.dropIndex("idx_page_active").ifExists().execute();
  await db.schema.dropIndex("idx_page_trashbin").ifExists().execute();
  await db.schema.dropIndex("idx_tags_org").ifExists().execute();
  await db.schema.dropIndex("idx_page_tag_tag_id").ifExists().execute();
};
