import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:spaceId",
    { schema: { params: spacesReqParams } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      const result = await db
        .deleteFrom("space")
        .where("createdBy", "=", userId)
        .where("id", "=", spaceId)
        .returning("id")
        .executeTakeFirst();

      if (!result) return res.code(400).send();
      return res.code(204).send();
    },
  );
};
