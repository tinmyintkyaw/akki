import { spaceIdSchema } from "#/core/tags/tags.schemas.js";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getTagsRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get("/", { schema: { params: spaceIdSchema } }, async (req, res) => {
    const { db } = fastify;
    const { userId } = req.getDecorator<Session>("session");
    const { spaceId } = req.params;

    const result = await db
      .selectFrom("tag")
      .selectAll()
      .where("organizationId", "=", spaceId)
      .where((eb) =>
        eb.exists(
          eb
            .selectFrom("member")
            .select(eb.lit(1).as("exists"))
            .where("organizationId", "=", spaceId)
            .where("userId", "=", userId),
        ),
      )
      .execute();

    if (!result) return res.code(400).send();
    return res.send(result);
  });
};
