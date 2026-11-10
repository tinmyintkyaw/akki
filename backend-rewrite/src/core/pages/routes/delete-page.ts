import { spacePageIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deletePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/spaces/:spaceId/pages/:pageId",
    {
      schema: {
        params: spacePageIdSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, pageId } = req.params;

      const result = await db
        .deleteFrom("page")
        .where("organizationId", "=", spaceId)
        .where("id", "=", pageId)
        .returning(pageSelect)
        .executeTakeFirst();

      if (!result) throw fastify.httpErrors.notFound();
      return res.code(204).send();
    },
  );
};
