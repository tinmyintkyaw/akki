import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { tagNameSchema } from "./schema.js";

const app = new Hono();

app.post(
  "/spaces/:spaceId/tags/",
  zValidator("param", spaceIdSchema),
  zValidator("json", tagNameSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const { name } = c.req.valid("json");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const newTag = await db
      .insertInto("tag")
      .values({ name, organizationId: spaceId })
      .returningAll()
      .executeTakeFirst();

    if (!newTag) throw new HTTPException(400);

    return c.json(newTag, 201);
  },
);

export default app;
