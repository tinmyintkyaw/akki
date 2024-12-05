import { meilisearchClient } from "@/search/meilisearch.js";
import { logger } from "better-auth";

async function getDefaultSearchKey() {
  const allKeys = await meilisearchClient.getKeys();

  const defaultSearchKey = allKeys.results.find(
    (key) => key.name === "Default Search API Key",
  );

  if (!defaultSearchKey) {
    logger.error("Couldn't load default search key");
    process.exit(1);
  }

  return defaultSearchKey;
}

export const defaultSearchKey = await getDefaultSearchKey();
