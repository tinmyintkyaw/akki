import { spaceIdSchema } from "#/core/spaces/spaces.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getSpaceMembersRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/:spaceId/members",
    {
      schema: {
        params: spaceIdSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId } = req.params;

      const { userId } = req.getDecorator<Session>("session");

      const members = await db
        .selectFrom("spaceMembers")
        .select(["userId", "role"])
        .where("spaceId", "=", spaceId)
        .where((eb) =>
          eb.exists(
            eb
              .selectFrom("spaceMembers as auth")
              .select(eb.lit(1).as("exists"))
              .where("auth.spaceId", "=", spaceId)
              .where("auth.userId", "=", userId),
          ),
        )
        .orderBy("createdAt", "asc")
        .execute();

      if (members.length === 0) throw fastify.httpErrors.forbidden();

      return res.send(members);
    },
  );
};
