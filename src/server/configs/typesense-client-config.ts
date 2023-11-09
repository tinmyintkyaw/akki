import envVars from "@/configs/env-config";
import Typesense from "typesense";

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: envVars.TYPESENSE_HOST,
      port: envVars.TYPESENSE_PORT,
      protocol: "http",
    },
  ],
  apiKey: envVars.TYPESENSE_API_KEY,
});

export default typesenseClient;
