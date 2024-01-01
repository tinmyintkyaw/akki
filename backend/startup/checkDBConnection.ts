import { pool } from "@/configs/kysely.js";
import { logger } from "@/configs/logger.js";

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
