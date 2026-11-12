import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.post(
  "/spaces/:spaceId/tags",
  zValidator("param", spaceIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const { session } = c.get("session");

    const canRead = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "read",
    );

    if (!canRead) throw new HTTPException(401);

    const tags = await db
      .selectFrom("tag")
      .selectAll()
      .where("organizationId", "=", spaceId)
      .where((eb) =>
        eb.exists(
          eb
            .selectFrom("member")
            .select(eb.lit(1).as("exists"))
            .where("organizationId", "=", spaceId)
            .where("userId", "=", session.userId),
        ),
      )
      .execute();

    if (!tags) throw new HTTPException(400);

    return c.json(tags);
  },
);

export default app;
