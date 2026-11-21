import type { Database } from "#/db/database.js";
import { env } from "#/env.js";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";

export const pool = new pg.Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});
