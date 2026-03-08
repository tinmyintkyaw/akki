import { pageCreatePayload } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spacesReqParams,
        body: pageCreatePayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      const newPage = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return await trx
          .insertInto("page")
          .values({ name, spaceId, createdBy: userId, ydoc: Buffer.from("") }) // TODO: properly initialize ydoc
          .returning(pageSelect)
          .executeTakeFirst();
      });

      if (!newPage) return res.code(400).send();
      return res.code(201).send(newPage);
    },
  );
};
