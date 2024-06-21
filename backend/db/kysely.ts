import { parsedProcessEnv } from "@/env-vars/env-variables.js";
import { Database } from "@/types/database.js";
import { Kysely, PostgresDialect } from "kysely";
import postgres from "pg";

const pool = new postgres.Pool({
  database: parsedProcessEnv.POSTGRES_DB_NAME,
  host: parsedProcessEnv.POSTGRES_HOST,
  user: parsedProcessEnv.POSTGRES_USER,
  port: parsedProcessEnv.POSTGRES_PORT,
  password: parsedProcessEnv.POSTGRES_PASS,
  max: 10,
});

const dialect = new PostgresDialect({ pool });

const db = new Kysely<Database>({ dialect });

export { db, pool };
