import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { pageSelect } from "#/pages/page-queries.js";
import { pageQueryStringSchema, spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get(
  "/spaces/:spaceId/pages",
  zValidator("param", spaceIdSchema),
  zValidator("query", pageQueryStringSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const { deleted, pinned } = c.req.valid("query");

    const canRead = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "read",
    );

    if (!canRead) throw new HTTPException(401);

    let query = db
      .selectFrom("page")
      .where("organizationId", "=", spaceId)
      .select(pageSelect)
      .orderBy("id", "desc");

    if (deleted) {
      query = query.where("page.deletedAt", "is not", null);
    } else {
      query = query.where("page.deletedAt", "is", null);
    }

    if (pinned !== undefined) {
      query = query.where("page.isPinned", "=", pinned);
    }

    const pages = await query.execute();

    return c.json(pages);
  },
);

export default app;
