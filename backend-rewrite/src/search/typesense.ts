import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import Typesense, { Client as TypesenseClient } from "typesense";
import { setDefaultConfiguration } from "typesense-ts";

declare module "fastify" {
  interface FastifyInstance {
    typesense: TypesenseClient;
  }
}

const typesense: FastifyPluginAsync = async (fastify) => {
  setDefaultConfiguration({
    nodes: [
      {
        host: fastify.config.TYPESENSE_API_HOST,
        port: fastify.config.TYPESENSE_API_PORT,
        protocol: "http",
      },
    ],
    apiKey: fastify.config.TYPESENSE_API_KEY,
  });

  const typesense = new Typesense.Client({
    nodes: [
      {
        host: fastify.config.TYPESENSE_API_HOST,
        port: fastify.config.TYPESENSE_API_PORT,
        protocol: "http",
      },
    ],
    apiKey: fastify.config.TYPESENSE_API_KEY,
  });

  fastify.decorate("typesense", typesense);

  fastify.addHook("onReady", async () => {
    // TODO: look for existing collection and create one if not exists

    fastify.log.debug("Looking for existing search key");

    const settings = await fastify.db
      .selectFrom("systemSettings")
      .where("id", "=", 1)
      .select("typesenseSearchKey")
      .executeTakeFirstOrThrow();

    if (!settings.typesenseSearchKey) {
      fastify.log.debug("Existing search key not found, creating...");
      const newSearchKey = await typesense.keys().create({
        actions: ["documents:search"],
        collections: ["*"], // TODO: scope search key to collection
        description: "Global Search Key",
      });

      await fastify.db
        .updateTable("systemSettings")
        .set({ typesenseSearchKey: newSearchKey })
        .executeTakeFirstOrThrow();
    }
  });
};

export default fastifyPlugin(typesense, {
  name: "typesense",
  dependencies: ["config", "db"],
});
