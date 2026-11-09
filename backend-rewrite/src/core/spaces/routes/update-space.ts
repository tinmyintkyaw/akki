import { getSpaceRole, spaceSelect } from "#/core/spaces/spaces.queries.js";
import {
  spaceIdSchema,
  spaceNameSchema,
} from "#/core/spaces/spaces.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updateSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/:spaceId",
    {
      schema: {
        params: spaceIdSchema,
        body: spaceNameSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      const result = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "admin");

        if (role !== "admin") throw fastify.httpErrors.forbidden();

        return await trx
          .updateTable("space")
          .set({ name, updatedAt: new Date() })
          .where("space.id", "=", spaceId)
          .returning(spaceSelect)
          .executeTakeFirst();
      });

      if (!result) throw fastify.httpErrors.notFound();

      return res.send(result);
    },
  );
};
