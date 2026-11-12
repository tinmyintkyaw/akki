import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { pageSelect } from "#/pages/page-queries.js";
import { pageUpdatePayload, spacePageIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.patch(
  "/spaces/:spaceId/pages/:pageId",
  zValidator("param", spacePageIdSchema),
  zValidator("json", pageUpdatePayload),
  sessionMiddleware,
  async (c) => {
    const { spaceId, pageId } = c.req.valid("param");
    const { name, isPinned, isDeleted } = c.req.valid("json");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const updatedPage = await db
      .updateTable("page")
      .where("id", "=", pageId)
      .where("organizationId", "=", spaceId)
      .set({
        name,
        deletedAt: isDeleted ? new Date() : null,
        isPinned,
      })
      .returning(pageSelect)
      .executeTakeFirst();

    if (!updatedPage) throw new HTTPException(400);
    return c.json(updatedPage);
  },
);

export default app;
