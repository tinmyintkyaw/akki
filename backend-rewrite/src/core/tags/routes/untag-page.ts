import {
  spaceTagPageIdSchema,
  tagIdListSchema,
} from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const untagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
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
        .deleteFrom("pageTag")
        .where("pageId", "=", pageId)
        .where("tagId", "in", tags)
        .execute();

      return res.code(200).send();
    },
  );
};
