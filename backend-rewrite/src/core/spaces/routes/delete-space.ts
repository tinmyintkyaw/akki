import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:spaceId",
    { schema: { params: spaceIdSchema, response: { 204: {} } } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "admin");

        if (role !== "admin") throw fastify.httpErrors.forbidden();

        const result = await trx
          .deleteFrom("space")
          .where("id", "=", spaceId)
          .executeTakeFirst();

        if (Number(result.numDeletedRows) === 0) {
          throw fastify.httpErrors.notFound();
        }

        return res.code(204).send();
      });
    },
  );
};
