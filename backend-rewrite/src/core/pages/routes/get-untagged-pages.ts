import { pageSelect } from "@/core/pages/queries/page-select";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getUntaggedPagesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/untagged",
    {
      schema: {
        params: spacesReqParams,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      const untaggedPages = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return trx
          .selectFrom("page")
          .select(pageSelect)
          .where("spaceId", "=", spaceId)
          .where(({ not, exists, selectFrom }) =>
            not(
              exists(
                selectFrom("pageTag")
                  .select("pageTag.pageId")
                  .whereRef("pageTag.pageId", "=", "page.id"),
              ),
            ),
          )
          .execute();
      });

      if (!untaggedPages) return res.code(400).send();
      return res.send(untaggedPages);
    },
  );
};
