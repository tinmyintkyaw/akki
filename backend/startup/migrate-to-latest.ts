import { logger } from "@/configs/logger.js";
import { migrator } from "@/configs/migrator.js";

async function migrateToLatest() {
  logger.info("Running migrations, if any");

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      logger.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      logger.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    logger.error("Failed to migrate");
    process.exit(1);
  }
}

export { migrateToLatest };
