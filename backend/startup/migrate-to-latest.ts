import { migrator } from "@/db/migrator.js";
import { logger } from "@/logger/index.js";

async function migrateToLatest() {
  logger.info("Running migrations, if any");

  const { error, results } = await migrator.migrateToLatest();
  // const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);

  results?.forEach((it) => {
    if (it.status === "Success") {
      logger.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      logger.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    logger.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }
}

export { migrateToLatest };
