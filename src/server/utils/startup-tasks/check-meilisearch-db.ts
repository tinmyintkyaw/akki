import logger from "@/configs/logger-config";
import meilisearchClient from "@/configs/meilisearch-client-config";
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

  try {
    await meilisearchClient
      .index("pages")
      .updateFilterableAttributes(["userId", "isDeleted", "isStarred"]);
  } catch (error) {
    process.exit(1);
  }
}

export default checkMellisearchDB;
