import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from "kysely";
import pg from "pg";

declare module "fastify" {
  interface FastifyInstance {
    db: DBInstance;
  }
}

const createDBInstance = (fastify: FastifyInstance) => {
  const pool = new pg.Pool({
    host: fastify.config.POSTGRES_HOST,
    port: fastify.config.POSTGRES_PORT,
    database: fastify.config.POSTGRES_DB,
    user: fastify.config.POSTGRES_USER,
    password: fastify.config.POSTGRES_PASSWORD,
  });

  return new Kysely({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });
};

export type DBInstance = ReturnType<typeof createDBInstance>;

export default fastifyPlugin(async (fastify) => {
  const db = createDBInstance(fastify);

  fastify.decorate("db", db);

  fastify.addHook("onReady", async () => {
    try {
      fastify.log.info("Checking database connection");
      await sql`SELECT 1`.execute(db);
      fastify.log.info("Database is ready");
    } catch (error) {
      fastify.log.error("Failed to connect to database");
      throw error;
    }
  });

  fastify.addHook("onClose", async () => {
    try {
      await db.destroy();
    } catch (error) {
      if (error instanceof Error) fastify.log.error(error);
    }
  });
});
