import { spaceSelect } from "#/core/spaces/spaces.queries.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getSpacesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get("/", async (req, res) => {
    const { db } = fastify;

    const { userId } = req.getDecorator<Session>("session");

    const result = await db
      .selectFrom("space")
      .innerJoin("spaceMembers", "spaceMembers.spaceId", "space.id")
      .select(spaceSelect)
      .where("spaceMembers.userId", "=", userId)
      .orderBy("space.createdAt", "asc")
      .execute();

    return res.send(result);
  });
};
