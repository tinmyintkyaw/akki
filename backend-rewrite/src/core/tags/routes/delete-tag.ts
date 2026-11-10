import { spaceTagIdSchema } from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:tagId",
    { schema: { params: spaceTagIdSchema } },
    async (req, res) => {
      const { db } = fastify;
      const { tagId, spaceId } = req.params;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

      const result = await db
        .deleteFrom("tag")
        .where("id", "=", tagId)
        .returning("id")
        .executeTakeFirst();

      if (!result) throw fastify.httpErrors.badRequest();
      return res.code(204).send();
    },
  );
};
