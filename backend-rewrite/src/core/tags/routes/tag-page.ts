import { pageIdSchema } from "#/core/pages/pages.schema.js";
import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { tagIdListSchema } from "#/core/tags/tags.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const tagPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
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
          .insertInto("pageTag")
          .values(tags.map((tagId) => ({ pageId, tagId })))
          .onConflict((oc) => oc.column("pageId").column("tagId").doNothing())
          .execute();
      });

      return res.code(201).send();
    },
  );
};
