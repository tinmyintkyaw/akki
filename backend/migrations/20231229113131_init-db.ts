import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.executeQuery(sql`CREATE EXTENSION IF NOT EXISTS ltree`.compile(db));

  await db.schema
    .createTable("user")
    .addColumn("id", "char(26)", (col) => col.notNull().primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("username", "text", (col) => col.unique())
    .addColumn("image", "text")
    .addColumn("email", "text")
    .addColumn("email_verified", "boolean")
    .execute();

  await db.schema
    .createTable("key")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("hashed_password", "text")
    .addColumn("user_id", "char(26)", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("page")
    .addColumn("id", "char(26)", (col) => col.notNull().primaryKey())
    .addColumn("page_name", "text", (col) => col.notNull())
    .addColumn("path", sql`ltree`, (col) => col.notNull())
    .addColumn("ydoc", "bytea", (col) => col.notNull())
    .addColumn("is_starred", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("modified_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("accessed_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("deleted_at", "timestamptz", (col) => col.defaultTo(null))
    .addColumn("user_id", "char(26)", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("file")
    .addColumn("id", "char(26)", (col) => col.notNull().primaryKey())
    .addColumn("file_name", "text", (col) => col.notNull())
    .addColumn("extension", "text", (col) => col.notNull())
    .addColumn("user_id", "char(26)", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("page_id", "char(26)", (col) =>
      col.notNull().references("page.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("setting")
    .addColumn("id", "char(26)", (col) => col.notNull().primaryKey())
    .addColumn("editor_width", "integer", (col) => col.notNull())
    .addColumn("user_id", "char(26)", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("global_variable")
    .addColumn("id", "serial", (col) => col.notNull().primaryKey())
    .addColumn("search_key_id", "text", (col) => col.notNull())
    .addColumn("search_key_value", "text", (col) => col.notNull())
    .execute();

  // GIST index on ltree column for performance
  await db.schema
    .createIndex("path_gist_index")
    .on("page")
    .using("gist")
    .column("path")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("user").cascade().execute();
  await db.schema.dropTable("key").cascade().execute();
  await db.schema.dropTable("page").cascade().execute();
  await db.schema.dropTable("file").cascade().execute();
  await db.schema.dropTable("setting").cascade().execute();
  await db.schema.dropTable("global_variable").cascade().execute();
}
