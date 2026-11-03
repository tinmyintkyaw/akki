import { getSpaceRole } from "@/core/spaces/spaces.queries";
import {
  memberIdSchema,
  memberRoleSchema,
  spaceIdSchema,
} from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const addSpaceMemberRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/:spaceId/members",
    {
      schema: {
        params: spaceIdSchema,
        body: memberIdSchema.extend(memberRoleSchema.shape),
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { memberId, role: memberRole } = req.body;

      const result = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "admin");

        if (role !== "admin") throw fastify.httpErrors.forbidden();

        return await trx
          .insertInto("spaceMembers")
          .values({ spaceId, userId: memberId, role: memberRole })
          .returning("spaceId")
          .onConflict((oc) => oc.doNothing())
          .executeTakeFirst();
      });

      if (!result) throw fastify.httpErrors.badRequest();

      return res.code(201).send();
    },
  );
};
