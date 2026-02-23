import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("email_verified", "boolean", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .createIndex("user_email_idx")
    .on("user")
    .column("email")
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("ip_address", "text")
    .addColumn("user_agent", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("session_user_id_idx")
    .on("session")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("session_token_idx")
    .on("session")
    .column("token")
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("account_id", "text", (col) => col.notNull())
    .addColumn("provider_id", "text", (col) => col.notNull())
    .addColumn("access_token", "text")
    .addColumn("refresh_token", "text")
    .addColumn("access_token_expires_at", "timestamptz")
    .addColumn("refresh_token_expires_at", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("password", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("account_user_id_idx")
    .on("account")
    .column("user_id")
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("user").cascade().execute();
  await db.schema.dropTable("session").cascade().execute();
  await db.schema.dropTable("account").cascade().execute();
  await db.schema.dropTable("verification").cascade().execute();
};
