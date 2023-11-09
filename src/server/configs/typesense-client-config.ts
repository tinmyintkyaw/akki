import Typesense from "typesense";

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: parseInt(process.env.TYPESENSE_PORT),
      protocol: "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
});

export default typesenseClient;
