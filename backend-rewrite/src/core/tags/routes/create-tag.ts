import { spaceIdSchema, tagNameSchema } from "#/core/tags/tags.schemas.js";
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
      const { spaceId } = req.params;
      const { name } = req.body;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

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
