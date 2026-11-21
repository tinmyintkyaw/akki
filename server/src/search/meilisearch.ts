import { env } from "#/env.js";
import { Meilisearch } from "meilisearch";

export const meilisearch = new Meilisearch({
  host: `${env.MEILISEARCH_HOST}:${env.MEILISEARCH_PORT}`,
  apiKey: env.MEILISEARCH_KEY,
});
