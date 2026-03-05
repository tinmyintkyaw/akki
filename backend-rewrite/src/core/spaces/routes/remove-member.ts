import { getOwnSpaces } from "@/core/spaces/spaces.queries";
import {
  spaceRemoveMemberPayload,
  spacesReqParams,
} from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const removeMemberRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/spaces/:spaceId/members",
    {
      schema: {
        params: spacesReqParams,
        body: spaceRemoveMemberPayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { member } = req.body;

      const result = await db.transaction().execute(async (trx) => {
        await getOwnSpaces(trx, { userId, spaceId }).executeTakeFirstOrThrow();

        return await db
          .deleteFrom("spaceMembers")
          .where("userId", "=", member)
          .where("spaceId", "=", spaceId)
          .returningAll()
          .executeTakeFirst();
      });

      if (!result) return res.code(400).send();
      return res.code(204).send();
    },
  );
};
