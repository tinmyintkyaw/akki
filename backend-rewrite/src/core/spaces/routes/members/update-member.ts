import { getSpaceRole } from "#/core/spaces/spaces.queries.js";
import {
  memberIdSchema,
  memberRoleSchema,
  spaceIdSchema,
} from "#/core/spaces/spaces.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updateSpaceMemberRoute: FastifyPluginAsyncZod = async (
  fastify,
) => {
  fastify.patch(
    "/:spaceId/members",
    {
      schema: {
        params: spaceIdSchema.extend(memberIdSchema.shape),
        body: memberRoleSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, memberId } = req.params;
      const { role } = req.body;

      const { userId } = req.getDecorator<Session>("session");

      const result = await db.transaction().execute(async (trx) => {
        const currUserRole = await getSpaceRole(trx, spaceId, userId, "admin");

        if (currUserRole !== "admin") throw fastify.httpErrors.forbidden();

        // prevent demoting to member if the there is the only one admin left
        if (role === "member") {
          const admins = await trx
            .selectFrom("spaceMembers")
            .select([
              "userId",
              (eb) => eb.fn.countAll<number>().as("total_admins"),
            ])
            .where("spaceId", "=", spaceId)
            .where("role", "=", "admin")
            .executeTakeFirst();

          if (!admins || admins.total_admins <= 1)
            throw fastify.httpErrors.badRequest();
        }

        return await trx
          .updateTable("spaceMembers")
          .set({ userId: memberId, role })
          .returningAll()
          .executeTakeFirst();
      });

      if (!result) throw fastify.httpErrors.notFound();

      return res.send(result);
    },
  );
};
