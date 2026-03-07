import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { getTag } from "@/core/tags/queries/get-tag";
import { moveTagQuery } from "@/core/tags/queries/move-tag";
import { tagSelect } from "@/core/tags/queries/tag-select";
import { tagsReqParams, tagUpdatePayload } from "@/core/tags/tags.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updateTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/:tagId",
    { schema: { params: tagsReqParams, body: tagUpdatePayload } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, tagId } = req.params;
      const { name, parentId } = req.body;

      const updatedTag = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        if (name) {
          await trx
            .updateTable("tag")
            .set({ name })
            .where("id", "=", tagId)
            .returning(tagSelect)
            .executeTakeFirstOrThrow();
        }

        if (parentId) {
          await moveTagQuery(trx, {
            tagId,
            parentId,
          }).executeTakeFirstOrThrow();
        }

        return await getTag(trx, { userId, spaceId, tagId }).executeTakeFirst();
      });

      if (!updatedTag) return res.code(400).send();
      return res.send(updatedTag);
    },
  );
};
