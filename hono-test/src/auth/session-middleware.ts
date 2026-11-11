import { auth } from "#/auth/auth.js";
import { createMiddleware } from "hono/factory";

type Env = {
  Variables: {
    session: typeof auth.$Infer.Session | null;
  };
};

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("session", session);

  await next();
});
