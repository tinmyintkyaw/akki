import { pagesReqParams } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deletePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:pageId",
    {
      schema: {
        params: pagesReqParams,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;

      const pages = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return trx
          .deleteFrom("page")
          .where("spaceId", "=", spaceId)
          .where("id", "=", pageId)
          .returning(pageSelect)
          .executeTakeFirst();
      });

      if (!pages) return res.code(400).send();
      return res.code(204).send();
    },
  );
};
