import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.executeQuery(sql`CREATE EXTENSION IF NOT EXISTS ltree`.compile(db));

  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("email_verified", "boolean", (col) => col.notNull())
    .addColumn("is_anonymous", "boolean")
    .addColumn("search_token", "text", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("ip_address", "text")
    .addColumn("user_agent", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("account_id", "text", (col) => col.notNull())
    .addColumn("provider_id", "text", (col) => col.notNull())
    .addColumn("access_token", "text")
    .addColumn("refresh_token", "text")
    .addColumn("access_token_expires_at", "timestamptz")
    .addColumn("refresh_token_expires_at", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("page")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
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
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("file")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("file_name", "text", (col) => col.notNull())
    .addColumn("extension", "text", (col) => col.notNull())
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("page_id", "text", (col) =>
      col.notNull().references("page.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("setting")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("editor_width", "integer", (col) => col.notNull())
    .addColumn("user_id", "text", (col) =>
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
  await db.schema.dropTable("session").cascade().execute();
  await db.schema.dropTable("account").cascade().execute();
  await db.schema.dropTable("verification").cascade().execute();
  await db.schema.dropTable("page").cascade().execute();
  await db.schema.dropTable("file").cascade().execute();
  await db.schema.dropTable("setting").cascade().execute();
  await db.schema.dropTable("global_variable").cascade().execute();
}
