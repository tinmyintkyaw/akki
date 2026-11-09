import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { tagNameSchema } from "#/core/tags/tags.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spaceIdSchema,
        body: tagNameSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      const newTag = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");

        if (!role) throw fastify.httpErrors.forbidden();

        return await trx
          .insertInto("tag")
          .values({ name, spaceId })
          .returningAll()
          .executeTakeFirst();
      });

      if (!newTag) throw fastify.httpErrors.internalServerError();

      return res.code(201).send(newTag);
    },
  );
};
