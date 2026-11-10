import { preHandlerAsyncHookHandler } from "fastify";

export const requireSession: preHandlerAsyncHookHandler = async (req, res) => {
  const session = await req.server.auth.api.getSession({
    headers: req.headers,
  });

  if (!session) return res.unauthorized();
  req.setDecorator("session", session);
};
