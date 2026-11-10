import {
  spaceTagPageIdSchema,
  tagIdListSchema,
} from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const untagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
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
        .deleteFrom("pageTag")
        .where("pageId", "=", pageId)
        .where("tagId", "in", tags)
        .execute();

      return res.code(200).send();
    },
  );
};
