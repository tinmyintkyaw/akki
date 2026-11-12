import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { spaceTagIdSchema } from "./schema.js";

const app = new Hono();

app.delete(
  "/spaces/:spaceId/tags/:tagId",
  zValidator("param", spaceTagIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, tagId } = c.req.valid("param");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const result = await db
      .deleteFrom("tag")
      .where("id", "=", tagId)
      .returning("id")
      .executeTakeFirst();

    if (!result) throw new HTTPException(400);

    return c.body(null, 204);
  },
);

export default app;
