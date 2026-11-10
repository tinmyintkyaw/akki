import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Key, MeiliSearch } from "meilisearch";

declare module "fastify" {
  interface FastifyInstance {
    meilisearch: MeiliSearch;
    defaultSearchKey: Key;
  }
}

const meilisearch: FastifyPluginAsync = async (fastify) => {
  const meilisearch = new MeiliSearch({
    host: `${fastify.config.MEILISEARCH_HOST}:${fastify.config.MEILISEARCH_PORT}`,
    apiKey: fastify.config.MEILISEARCH_KEY,
  });

  fastify.decorate("meilisearch", meilisearch);

  fastify.addHook("onReady", async () => {
    fastify.log.debug("Looking for default search key");
    const keys = await meilisearch.getKeys();

    const defaultSearchKey = keys.results.find(
      (key) =>
        key.actions.length === 1 &&
        key.actions.includes("search") &&
        key.name === "Default Search API Key",
    );

    if (!defaultSearchKey) throw new Error("Default search API key not found");
    fastify.decorate("defaultSearchKey", defaultSearchKey);
    fastify.log.debug("Found default search key");

    // Look for existing collections and create them if not exist
    try {
      await fastify.meilisearch.getIndex("pages");
    } catch (error) {
      fastify.log.info("index not found, creating...");
      await fastify.meilisearch.createIndex("pages", { primaryKey: "pageId" });
    }
  });

  //   Front-end search token endpoint
  //   fastify.get("/search/key", async (req, res) => {
  //     const session = await req.server.auth.api.getSession();

  //     if (!session) throw fastify.httpErrors.unauthorized();

  //     const searchToken = req.server.meilisearch.generateTenantToken(
  //       fastify.defaultSearchKey.uid,
  //       {
  //         pages: { filter: `memberIds = ${session.user.id}` },
  //       },
  //     );

  //     res.code(200).send({ searchToken });
  //   });
};

export default fastifyPlugin(meilisearch, {
  name: "meilisearch",
  dependencies: ["config", "db"],
});
