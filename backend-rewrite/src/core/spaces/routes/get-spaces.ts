import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getSpacesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get("/", async (req, res) => {
    const { db } = fastify;

    const { userId } = req.getDecorator<Session>("session");

    const result = await getAccessibleSpaces(db, { userId }).execute();

    return res.send(result);
  });
};
