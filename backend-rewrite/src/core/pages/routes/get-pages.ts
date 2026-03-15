import { pageQueryString, pagesResponse } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

// TODO: implement cursor pagination
export const getPagesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        params: spacesReqParams,
        querystring: pageQueryString,
        response: { 200: pagesResponse, 400: z.undefined() },
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { tag: tagId, deleted, untagged, limit, cursor } = req.query;

      const pages = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        let query = trx
          .selectFrom("page")
          .where("spaceId", "=", spaceId)
          .select(pageSelect)
          .orderBy("id", "desc")
          .limit(limit + 1);

        if (cursor) {
          query = query.where("id", "<", cursor);
        }

        if (tagId) {
          query = query
            .innerJoin("pageTag", "pageTag.pageId", "page.id")
            .where("tagId", "=", tagId);
        }

        if (deleted) {
          query = query.where("page.deletedAt", "is not", null);
        } else {
          query = query.where("page.deletedAt", "is", null);
        }

        if (untagged) {
          query = query.where(({ not, exists, selectFrom }) =>
            not(
              exists(
                selectFrom("pageTag")
                  .select("pageTag.pageId")
                  .whereRef("pageTag.pageId", "=", "page.id"),
              ),
            ),
          );
        }

        return query.execute();
      });

      if (!pages) return res.code(400).send();

      const response = {
        hasMore: pages.length > limit ? true : false,
        pages: pages.length > limit ? pages.slice(0, -1) : pages,
      };

      return res.send(response);
    },
  );
};
