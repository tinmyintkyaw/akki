import dotenv from "dotenv";
import Typesense from "typesense";

dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT
  ? parseInt(process.env.TYPESENSE_PORT)
  : 8108;

if (!process.env.TYPESENSE_API_KEY) {
  throw new Error("Missing TYPESENSE_API_KEY");
}

const serverTypesenseClient = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: TYPESENSE_PORT,
      protocol: "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
});

export default serverTypesenseClient;
