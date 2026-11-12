import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { pageSelect } from "#/pages/page-queries.js";
import { spacePageIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get(
  "/spaces/:spaceId/pages/:pageId",
  zValidator("param", spacePageIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, pageId } = c.req.valid("param");

    const canRead = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "read",
    );

    if (!canRead) throw new HTTPException(401);

    const page = await db
      .selectFrom("page")
      .where("organizationId", "=", spaceId)
      .where("id", "=", pageId)
      .select(pageSelect)
      .executeTakeFirst();

    if (!page) throw new HTTPException(404);
    return c.json(page);
  },
);

export default app;
