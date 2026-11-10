import {
  spaceTagPageIdSchema,
  tagIdListSchema,
} from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const tagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/spaces/:spaceId/pages/:pageId/tags",
    {
      schema: {
        params: spaceTagPageIdSchema,
        body: tagIdListSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { pageId } = req.params;
      const { tags } = req.body;

      await db
        .insertInto("pageTag")
        .values(tags.map((tagId) => ({ pageId, tagId })))
        .onConflict((oc) => oc.column("pageId").column("tagId").doNothing())
        .execute();

      return res.code(201).send();
    },
  );
};
