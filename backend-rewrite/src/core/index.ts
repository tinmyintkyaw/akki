import pages from "#/core/pages/index.js";
import tags from "#/core/tags/index.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const core: FastifyPluginAsyncZod = async (fastify) => {
  fastify.addHook("preHandler", fastify.authGuard.requireSession);

  fastify.register(tags);
  fastify.register(pages);

  // fastify.register(tagPageRoute, { prefix: "/spaces/:spaceId/pages" });
  // fastify.register(untagPageRoute, { prefix: "/spaces/:spaceId/pages" });

  // fastify.register(files, { prefix: "/spaces/:spaceId/files" });
};
