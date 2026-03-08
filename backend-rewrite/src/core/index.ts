import { authGuardHandler } from "@/auth/auth-guard-handler";
import pages from "@/core/pages";
import spaces from "@/core/spaces";
import tags from "@/core/tags";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const core: FastifyPluginAsyncZod = async (fastify) => {
  fastify.decorateRequest("session", null);
  fastify.addHook("preHandler", authGuardHandler);

  fastify.register(spaces, { prefix: "/spaces" });
  fastify.register(tags, { prefix: "/spaces/:spaceId/tags" });
  fastify.register(pages, { prefix: "/spaces/:spaceId/pages" });
};
