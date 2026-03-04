import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("space")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("name", "text", (col) => col.notNull().defaultTo("New Space"))
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .createIndex("space_created_by_idx")
    .on("space")
    .column("created_by")
    .execute();

  await db.schema
    .createTable("space_members")
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint("space_members_pk", ["space_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("space_members_user_id_idx")
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
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("page_created_by_idx")
    .on("page")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("page_space_id_idx")
    .on("page")
    .column("space_id")
    .execute();

  await db.schema
    .createIndex("page_deleted_at_idx")
    .on("page")
    .column("deleted_at")
    .where("deleted_at", "is", null)
    .execute();

  await db.executeQuery(sql`CREATE EXTENSION IF NOT EXISTS ltree`.compile(db));

  await db.schema
    .createTable("tag")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("path", sql`ltree`, (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("space_id", "uuid", (col) =>
      col.notNull().references("space.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("tag_created_by_idx")
    .on("tag")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("tag_space_id_idx")
    .on("tag")
    .column("space_id")
    .execute();

  await db.schema
    .createIndex("tag_path_gist_idx")
    .on("tag")
    .column("path")
    .using("gist")
    .execute();

  await db.schema
    .createTable("page_tag")
    .addColumn("page_id", "uuid", (col) =>
      col.notNull().references("page.id").onDelete("cascade"),
    )
    .addColumn("tag_id", "uuid", (col) =>
      col.notNull().references("tag.id").onDelete("cascade"),
    )
    .addColumn("created_by", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint("page_tag_pk", ["page_id", "tag_id"])
    .execute();

  await db.schema
    .createIndex("page_tag_tag_id_idx")
    .on("page_tag")
    .column("tag_id")
    .execute();

  await db.schema
    .createIndex("page_tag_created_by_idx")
    .on("page_tag")
    .column("created_by")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("space").cascade().execute();
  await db.schema.dropTable("space_members").cascade().execute();
  await db.schema.dropTable("page").cascade().execute();
  await db.schema.dropTable("tag").cascade().execute();
  await db.schema.dropTable("page_tag").cascade().execute();
};
