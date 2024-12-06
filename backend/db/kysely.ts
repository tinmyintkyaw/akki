import { Database } from "@/types/database.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
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

const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});

export { db, pool };
