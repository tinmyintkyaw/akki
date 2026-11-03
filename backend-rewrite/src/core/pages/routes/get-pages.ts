import { pageQueryStringSchema } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

// TODO: implement cursor pagination
export const getPagesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        params: spaceIdSchema,
        querystring: pageQueryStringSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { deleted, pinned } = req.query;

      const pages = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");

        if (!role) throw fastify.httpErrors.forbidden();

        let query = trx
          .selectFrom("page")
          .where("spaceId", "=", spaceId)
          .select(pageSelect)
          .orderBy("id", "desc")
          .limit(limit + 1);

        if (cursor) {
          query = query.where("id", "<", cursor);
        }

        if (deleted) {
          query = query.where("page.deletedAt", "is not", null);
        } else {
          query = query.where("page.deletedAt", "is", null);
        }

        if (pinned !== undefined) {
          query = query.where("page.isPinned", "=", pinned);
        }

        return query.execute();
      });

      if (!pages) throw fastify.httpErrors.notFound();
      return res.send(pages);
    },
  );
};
