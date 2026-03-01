import { Session } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { preHandlerAsyncHookHandler } from "fastify";

const authGuardHandler: preHandlerAsyncHookHandler = async (request, reply) => {
  const session = await request.server.auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) return reply.code(401).send();
  request.setDecorator<Session>("session", session.session);
};

export { authGuardHandler };
