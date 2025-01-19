import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { Meilisearch } from "meilisearch";
import url from "url";

const meilisearchHostURL = url.format({
  protocol: "http",
  hostname: parsedProcessEnv.MEILI_HOST,
  port: parsedProcessEnv.MEILI_PORT,
});

const meilisearchClient = new Meilisearch({
  host: meilisearchHostURL,
  apiKey: parsedProcessEnv.MEILI_MASTER_KEY,
});

export { meilisearchClient };
