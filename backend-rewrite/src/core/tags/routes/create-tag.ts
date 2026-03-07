import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { tagSelect } from "@/core/tags/queries/tag-select";
import { tagCreatePayload } from "@/core/tags/tags.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { sql } from "kysely";
import { v7 as uuidv7 } from "uuid";

export const createTagRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spacesReqParams,
        body: tagCreatePayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name, parentId } = req.body;

      const newTag = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        const parentTag = parentId
          ? await trx
              .selectFrom("tag")
              .select("path")
              .where("spaceId", "=", spaceId)
              .where("id", "=", parentId)
              .executeTakeFirstOrThrow()
          : null;

        const newTagId = uuidv7();

        return await db
          .insertInto("tag")
          .values({
            id: newTagId,
            name,
            spaceId,
            path: parentTag
              ? sql`(${parentTag.path})::ltree || (${newTagId})::ltree`
              : newTagId,
            createdBy: userId,
          })
          .returning(tagSelect)
          .executeTakeFirst();
      });

      if (!newTag) return res.code(400).send();
      return res.code(201).send(newTag);
    },
  );
};
