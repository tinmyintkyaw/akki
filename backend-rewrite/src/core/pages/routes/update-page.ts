import { pagesReqParams, pageUpdatePayload } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updatePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/",
    {
      schema: {
        params: pagesReqParams,
        body: pageUpdatePayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;
      const { name, deletedAt: deletedAtPayload } = req.body;

      const newPage = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return trx
          .updateTable("page")
          .where("id", "=", pageId)
          .where("spaceId", "=", spaceId)
          .set({
            name,
            deletedAt:
              typeof deletedAtPayload === "string"
                ? new Date(deletedAtPayload)
                : deletedAtPayload,
          })
          .returning(pageSelect)
          .executeTakeFirst();
      });

      if (!newPage) return res.code(400).send();
      return res.code(201).send(newPage);
    },
  );
};
