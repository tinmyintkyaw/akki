import { pageIdSchema } from "@/core/pages/pages.schema";
import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { tagIdListSchema } from "@/core/tags/tags.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const tagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:pageId/tags",
    {
      schema: {
        params: spaceIdSchema.extend(pageIdSchema.shape),
        body: tagIdListSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;
      const { tags } = req.body;

      await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");
        if (!role) throw fastify.httpErrors.forbidden();

        await trx
          .deleteFrom("pageTag")
          .where("pageId", "=", pageId)
          .where("tagId", "in", tags)
          .execute();
      });

      return res.code(200).send();
    },
  );
};
