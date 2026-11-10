import {
  pageQueryStringSchema,
  spaceIdSchema,
} from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

// TODO: implement cursor pagination
export const getPagesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/spaces/:spaceId/pages",
    {
      schema: {
        params: spaceIdSchema,
        querystring: pageQueryStringSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("read"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId } = req.params;
      const { deleted, pinned } = req.query;

      let query = db
        .selectFrom("page")
        .where("organizationId", "=", spaceId)
        .select(pageSelect)
        .orderBy("id", "desc");

      if (deleted) {
        query = query.where("page.deletedAt", "is not", null);
      } else {
        query = query.where("page.deletedAt", "is", null);
      }

      if (pinned !== undefined) {
        query = query.where("page.isPinned", "=", pinned);
      }

      const pages = await query.execute();

      return res.send(pages);
    },
  );
};
