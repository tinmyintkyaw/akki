import { auth } from "#/auth/auth.js";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

type Env = {
  Variables: {
    session: typeof auth.$Infer.Session;
  };
};

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401, { message: "Unauthorized" });

  c.set("session", session);

  await next();
});
