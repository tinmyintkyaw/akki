import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { getTag } from "@/core/tags/queries/get-tag";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getTagsRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    { schema: { params: spacesReqParams } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      const result = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return await getTag(trx, { userId, spaceId }).execute();
      });

      if (!result) return res.code(400).send();
      return res.send(result);
    },
  );
};
