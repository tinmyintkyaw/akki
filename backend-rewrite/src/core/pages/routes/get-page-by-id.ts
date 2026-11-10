import { spacePageIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getPageByIdRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/:pageId",
    {
      schema: {
        params: spacePageIdSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, pageId } = req.params;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

      const pages = await db
        .selectFrom("page")
        .where("organizationId", "=", spaceId)
        .where("id", "=", pageId)
        .select(pageSelect)
        .executeTakeFirst();

      if (!pages) throw fastify.httpErrors.notFound();
      return res.send(pages);
    },
  );
};
