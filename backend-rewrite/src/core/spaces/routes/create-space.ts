import { spaceSelect } from "@/core/spaces/spaces.queries";
import { spaceNameSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post("/", { schema: { body: spaceNameSchema } }, async (req, res) => {
    const { db } = fastify;
    const { userId } = req.getDecorator<Session>("session");
    const { name } = req.body;

    const result = await db.transaction().execute(async (trx) => {
      const newSpace = await trx
        .insertInto("space")
        .values({ name })
        .returning(spaceSelect)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("spaceMembers")
        .values({ spaceId: newSpace.id, userId, role: "admin" })
        .executeTakeFirstOrThrow();

      return newSpace;
    });

    return res.code(201).send(result);
  });
};
