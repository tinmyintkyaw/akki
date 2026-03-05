import { spaceSelect } from "@/core/spaces/spaces.queries";
import {
  spacesCreateUpdatePayload,
  spacesReqParams,
} from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updateSpaceRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/:spaceId",
    {
      schema: {
        params: spacesReqParams,
        body: spacesCreateUpdatePayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      const result = await db
        .updateTable("space")
        .where("createdBy", "=", userId)
        .where("id", "=", spaceId)
        .set({ name })
        .returning(spaceSelect)
        .executeTakeFirst();

      if (!result) return res.code(400).send();
      return res.send(result);
    },
  );
};
