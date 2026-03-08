import { pageTagReqParams } from "@/core/pages/pages.schema";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const tagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/:pageId/tags/:tagId",
    { schema: { params: pageTagReqParams } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId, tagId } = req.params;

      const result = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return await trx
          .insertInto("pageTag")
          .values({ pageId, tagId, createdBy: userId })
          .returningAll()
          .executeTakeFirst();
      });

      if (!result) return res.code(400).send();
      return res.code(201).send();
    },
  );
};
