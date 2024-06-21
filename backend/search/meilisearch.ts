import { parsedProcessEnv } from "@/env-vars/env-variables.js";
import { Meilisearch } from "meilisearch";

const { MEILI_HOST, MEILI_PORT, MEILI_MASTER_KEY } = parsedProcessEnv;

const meilisearchClient = new Meilisearch({
  host: `http://${MEILI_HOST}:${MEILI_PORT}`,
  apiKey: MEILI_MASTER_KEY,
});

export { meilisearchClient };
