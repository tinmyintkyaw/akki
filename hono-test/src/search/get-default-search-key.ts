import { meilisearch } from "./meilisearch.js";

export const getDefaultSearchKey = async () => {
  const keys = await meilisearch.getKeys();

  const defaultSearchKey = keys.results.find(
    (key) =>
      key.actions.length === 1 &&
      key.actions.includes("search") &&
      key.name === "Default Search API Key",
  );

  if (!defaultSearchKey) throw new Error("Default search API key not found");

  console.debug("Found default search key");

  return defaultSearchKey;
};
