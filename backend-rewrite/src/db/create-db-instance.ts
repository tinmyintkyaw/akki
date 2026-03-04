import { Database } from "@/db/database";
import { FastifyInstance } from "fastify";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";

const createDBInstance = (fastify: FastifyInstance) => {
  const pool = new pg.Pool({
    host: fastify.config.POSTGRES_HOST,
    port: fastify.config.POSTGRES_PORT,
    database: fastify.config.POSTGRES_DB,
    user: fastify.config.POSTGRES_USER,
    password: fastify.config.POSTGRES_PASSWORD,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });
};

export type DBInstance = ReturnType<typeof createDBInstance>;
export { createDBInstance };
