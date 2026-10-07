import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("space")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("name", "text", (col) => col.notNull().defaultTo("New Space"))
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .createTable("space_members")
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )

    .addColumn("role", "text", (col) =>
      col.check(sql`role IN ('admin', 'member')`),
    )

    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz")

    .addPrimaryKeyConstraint("space_members_pk", ["space_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("idx_space_members_user_id")
    .on("space_members")
    .column("user_id")
    .execute();

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

    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )

    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("idx_page_active")
    .on("page")
    .columns(["space_id", "updated_at"])
    .where(sql.ref("deleted_at"), "is", null)
    .execute();

  await db.schema
    .createTable("tag")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )

    .addColumn("name", "text", (col) => col.notNull())

    .addUniqueConstraint("unique_space_tag", ["space_id", "name"])
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
    .createIndex("idx_page_tag_tag_id")
    .on("page_tag")
    .column("tag_id")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("space").cascade().execute();
  await db.schema.dropTable("space_members").cascade().execute();
  await db.schema.dropTable("page").cascade().execute();
  await db.schema.dropTable("tag").cascade().execute();
  await db.schema.dropTable("page_tag").cascade().execute();
};
