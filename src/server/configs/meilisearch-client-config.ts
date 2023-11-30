import envVars from "@/configs/env-config";
import { Meilisearch } from "meilisearch";

const meilisearchClient = new Meilisearch({
  host: `http://${envVars.MEILI_HOST}:${envVars.MEILI_PORT}`,
  apiKey: envVars.MEILI_MASTER_KEY,
});

export default meilisearchClient;
