import {
  createHocuspocusInstance,
  CustomContext,
} from "@/collaboration/hocuspocus";
import { pagesReqParams } from "@/core/pages/pages.schema";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const collaboration: FastifyPluginAsyncZod = async (fastify) => {
  const hocuspocus = createHocuspocusInstance(fastify);

  fastify.get(
    "/:pageId",
    {
      websocket: true,
      schema: { params: pagesReqParams },
    },
    (socket, req) => {
      const { spaceId, pageId } = req.params;
      const { userId } = req.getDecorator<Session>("session");

      const customContext: CustomContext = { userId, spaceId, pageId };

      hocuspocus.handleConnection(socket, req.raw, customContext);
    },
  );
};
