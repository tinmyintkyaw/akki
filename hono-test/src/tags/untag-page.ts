import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spacePageIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { tagIdListSchema } from "./schema.js";

const app = new Hono();

app.delete(
  "/spaces/:spaceId/pages/:pageId/tags",
  zValidator("param", spacePageIdSchema),
  zValidator("json", tagIdListSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, pageId } = c.req.valid("param");
    const { tags } = c.req.valid("json");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const result = await db
      .deleteFrom("pageTag")
      .where("pageId", "=", pageId)
      .where("tagId", "in", tags)
      .returning("tagId")
      .execute();

    if (result.length <= 0) throw new HTTPException(400);
    return c.body(null, 204);
  },
);

export default app;
