import { authGuardHandler } from "#/auth/auth-guard-handler.js";
import pages from "#/core/pages/index.js";
import spaces from "#/core/spaces/index.js";
import tags from "#/core/tags/index.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const core: FastifyPluginAsyncZod = async (fastify) => {
  fastify.decorateRequest("session", null);
  fastify.addHook("preHandler", authGuardHandler);

  fastify.register(spaces, { prefix: "/spaces" });
  fastify.register(tags, { prefix: "/spaces/:spaceId/tags" });
  fastify.register(pages, { prefix: "/spaces/:spaceId/pages" });
  // fastify.register(files, { prefix: "/spaces/:spaceId/files" });
};
