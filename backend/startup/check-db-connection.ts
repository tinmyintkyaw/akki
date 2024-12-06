import { pool } from "@/db/kysely.js";
import { logger } from "@/logger/index.js";

export async function checkDBConnection() {
  try {
    logger.info("Connecting to database");
    await pool.connect();
    logger.info("Connect to database successful");
  } catch (error) {
    logger.error("Failed to connect to database");
    process.exit(1);
  }
}
