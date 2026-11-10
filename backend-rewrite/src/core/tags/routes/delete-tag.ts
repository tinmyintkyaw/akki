import { spaceTagIdSchema } from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/spaces/:spaceId/tags/:tagId",
    {
      schema: { params: spaceTagIdSchema },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { tagId } = req.params;

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
