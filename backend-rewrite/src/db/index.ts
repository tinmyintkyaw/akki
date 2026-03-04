import { createDBInstance, DBInstance } from "@/db/create-db-instance";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely";
import * as path from "path";

declare module "fastify" {
  interface FastifyInstance {
    db: DBInstance;
  }
}

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
