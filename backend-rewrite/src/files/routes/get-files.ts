import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getFilesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        params: spacesReqParams,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      const files = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return trx
          .selectFrom("file")
          .selectAll()
          .where("spaceId", "=", spaceId)
          .execute();
      });

      if (!files) return res.code(400).send();

      return res.send(files);
    },
  );
};
