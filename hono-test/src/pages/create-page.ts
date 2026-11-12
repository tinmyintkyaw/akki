import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { pageSelect } from "#/pages/page-queries.js";
import { pageNameSchema, spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as Y from "yjs";

const app = new Hono();

app.post(
  "/spaces/:spaceId/pages",
  zValidator("param", spaceIdSchema),
  zValidator("json", pageNameSchema),
  sessionMiddleware,
  async (c) => {
    const session = c.var.session;
    const { spaceId } = c.req.valid("param");
    const { name } = c.req.valid("json");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );
    if (!canWrite) throw new HTTPException(401);

    const newPage = await db
      .insertInto("page")
      .values({
        name,
        organizationId: spaceId,
        authorId: session.user.id,
        ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
      })
      .returning(pageSelect)
      .executeTakeFirst();

    if (!newPage) throw new HTTPException(400);
    return c.json(newPage, 201);
  },
);

export default app;
