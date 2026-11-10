import { pageNameSchema, spaceIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spaceIdSchema,
        body: pageNameSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

      const newPage = await db
        .insertInto("page")
        .values({
          name,
          organizationId: spaceId,
          authorId: userId,
          ydoc: Buffer.from(""), // TODO: properly initialize ydoc
        })
        .returning(pageSelect)
        .executeTakeFirst();

      if (!newPage) throw fastify.httpErrors.notFound();
      return res.code(201).send(newPage);
    },
  );
};
