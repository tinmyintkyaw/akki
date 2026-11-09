import { pageIdSchema } from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deletePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
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

      const result = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "admin");

        if (role !== "admin") throw fastify.httpErrors.forbidden();

        return trx
          .deleteFrom("page")
          .where("spaceId", "=", spaceId)
          .where("id", "=", pageId)
          .returning(pageSelect)
          .executeTakeFirst();
      });

      if (!result) throw fastify.httpErrors.notFound();

      return res.code(204).send();
    },
  );
};
