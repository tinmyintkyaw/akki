import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { memberIdSchema, spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const removeSpaceMemberRoute: FastifyPluginAsyncZod = async (
  fastify,
) => {
  fastify.delete(
    "/:spaceId/members/:memberId",
    {
      schema: {
        params: spaceIdSchema.extend(memberIdSchema.shape),
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, memberId } = req.params;

      await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "admin");

        if (role !== "admin") throw fastify.httpErrors.forbidden();

        await trx
          .deleteFrom("spaceMembers")
          .where("spaceId", "=", spaceId)
          .where("userId", "=", memberId)
          .executeTakeFirstOrThrow();
      });

      return res.code(204).send();
    },
  );
};
