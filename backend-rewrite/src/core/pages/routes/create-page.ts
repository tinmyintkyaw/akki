import { pageNameSchema, spaceIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/spaces/:spaceId/pages",
    {
      schema: {
        params: spaceIdSchema,
        body: pageNameSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },

    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

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
