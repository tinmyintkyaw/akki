import { pageIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getPageByIdRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/:pageId",
    {
      schema: {
        params: spaceIdSchema.extend(pageIdSchema.shape),
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;

      const pages = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");

        if (!role) throw fastify.httpErrors.forbidden();

        return trx
          .selectFrom("page")
          .where("spaceId", "=", spaceId)
          .where("id", "=", pageId)
          .select(pageSelect)
          .executeTakeFirst();
      });

      if (!pages) throw fastify.httpErrors.notFound();
      return res.send(pages);
    },
  );
};
