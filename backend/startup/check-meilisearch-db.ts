import { logger } from "@/configs/logger.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { MeiliSearchApiError } from "meilisearch";

async function checkMellisearchDB() {
  try {
    logger.info("Checking for existing search index");

    await meilisearchClient.index("pages").getRawInfo();

    logger.info("Search index found");
  } catch (error) {
    if (error instanceof MeiliSearchApiError && error.httpStatus === 404) {
      logger.info("Collection not found, creating...");

      await meilisearchClient.createIndex("pages", {
        primaryKey: "id",
      });

      logger.info("Created collection!");
    }

    process.exit(1);
  }

  logger.info("Connect to Meilisearch successful");

  try {
    await meilisearchClient
      .index("pages")
      .updateFilterableAttributes(["userId", "isDeleted", "isStarred"]);

    await meilisearchClient
      .index("pages")
      .updateSearchableAttributes(["pageName", "textContent.text"]);
  } catch (error) {
    logger.error("Failed to connect to Meilisearch");
    process.exit(1);
  }
}

export { checkMellisearchDB };
