import {
  spaceTagPageIdSchema,
  tagIdListSchema,
} from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const tagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/pages/:pageId/tags",
    {
      schema: {
        params: spaceTagPageIdSchema,
        body: tagIdListSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, pageId } = req.params;
      const { tags } = req.body;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

      await db
        .insertInto("pageTag")
        .values(tags.map((tagId) => ({ pageId, tagId })))
        .onConflict((oc) => oc.column("pageId").column("tagId").doNothing())
        .execute();

      return res.code(201).send();
    },
  );
};
