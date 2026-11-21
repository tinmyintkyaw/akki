import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get(
  "/spaces/:spaceId/files",
  zValidator("param", spaceIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId } = c.req.valid("param");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const files = await db
      .selectFrom("file")
      .selectAll()
      .where("organizationId", "=", spaceId)
      .execute();

    return c.json(files);
  },
);

export default app;
