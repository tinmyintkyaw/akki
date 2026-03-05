import { getOwnSpaces } from "@/core/spaces/spaces.queries";
import {
  spaceAddMembersPayload,
  spacesReqParams,
} from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const addMembersRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/:spaceId/members",
    {
      schema: {
        params: spacesReqParams,
        body: spaceAddMembersPayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { members } = req.body;

      const result = await db.transaction().execute(async (trx) => {
        await getOwnSpaces(trx, { userId, spaceId }).executeTakeFirstOrThrow();

        return await trx
          .insertInto("spaceMembers")
          .values(members.map((member) => ({ spaceId, userId: member })))
          .returningAll()
          .executeTakeFirst();
      });

      if (!result) return res.code(400).send();
      return res.code(201).send();
    },
  );
};
