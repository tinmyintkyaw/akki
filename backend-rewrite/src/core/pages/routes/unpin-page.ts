import { pagesReqParams } from "@/core/pages/pages.schema";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const unpinPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:pageId/pin",
    { schema: { params: pagesReqParams } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;

      const result = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return await trx
          .deleteFrom("pinnedPage")
          .where("pageId", "=", pageId)
          .where("userId", "=", userId)
          .returningAll()
          .executeTakeFirst();
      });

      if (!result) return res.code(400).send();
      return res.code(204).send();
    },
  );
};
