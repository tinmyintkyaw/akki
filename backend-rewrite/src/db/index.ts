import { Database } from "@/db/db-types";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { promises as fs } from "fs";
import {
  CamelCasePlugin,
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import * as path from "path";
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

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });
};

export type DBInstance = ReturnType<typeof createDBInstance>;

const db: FastifyPluginAsync = async (fastify) => {
  const db = createDBInstance(fastify);

  fastify.decorate("db", db);

  fastify.addHook("onReady", async () => {
    try {
      const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder: path.join(process.cwd(), "src", "db", "migrations"),
        }),
      });

      const { error, results } = await migrator.migrateToLatest();

      results?.forEach((it) => {
        if (it.status === "Success") {
          fastify.log.info(
            `migration "${it.migrationName}" was executed successfully`,
          );
        } else if (it.status === "Error") {
          fastify.log.error(
            `failed to execute migration "${it.migrationName}"`,
          );
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      fastify.log.error(error, "Failed to migrate");
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
};

export default fastifyPlugin(db, { name: "db", dependencies: ["config"] });
