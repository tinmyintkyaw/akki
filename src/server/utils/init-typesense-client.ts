import Typesense from "typesense";

const initTypesenseClient = (host: string, port: number, apiKey: string) =>
  new Typesense.Client({
    nodes: [
      {
        host: host,
        port: port,
        protocol: "http",
      },
    ],
    apiKey: apiKey,
  });

export default initTypesenseClient;
