import { spaceIdSchema, tagNameSchema } from "#/core/tags/tags.schemas.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/spaces/:spaceId/tags",
    {
      schema: {
        params: spaceIdSchema,
        body: tagNameSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId } = req.params;
      const { name } = req.body;

      const newTag = await db
        .insertInto("tag")
        .values({ name, organizationId: spaceId })
        .returningAll()
        .executeTakeFirst();

      if (!newTag) throw fastify.httpErrors.internalServerError();

      return res.code(201).send(newTag);
    },
  );
};
