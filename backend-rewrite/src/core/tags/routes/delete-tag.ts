import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { tagIdSchema } from "#/core/tags/tags.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:tagId",
    { schema: { params: spaceIdSchema.extend(tagIdSchema.shape) } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { tagId, spaceId } = req.params;

      const result = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");

        if (!role) throw fastify.httpErrors.forbidden();

        return await trx
          .deleteFrom("tag")
          .where("id", "=", tagId)
          .returning("id")
          .executeTakeFirst();
      });

      if (!result) throw fastify.httpErrors.badRequest();

      return res.code(204).send();
    },
  );
};
