import { spaceSelect } from "@/core/spaces/spaces.queries";
import { spacesCreateUpdatePayload } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    { schema: { body: spacesCreateUpdatePayload } },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { name } = req.body;

      const result = await db
        .insertInto("space")
        .values({ name, createdBy: userId })
        .returning(spaceSelect)
        .executeTakeFirstOrThrow();

      return res.send(result);
    },
  );
};
