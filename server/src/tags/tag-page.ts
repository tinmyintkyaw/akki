import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spacePageIdSchema } from "#/pages/schemas.js";
import { syncPageMetadata } from "#/search/sync-to-meilisearch.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { tagIdListSchema } from "./schema.js";

export const tagPage = new Hono().put(
  "/spaces/:spaceId/pages/:pageId/tags",
  zValidator("param", spacePageIdSchema),
  zValidator("json", tagIdListSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, pageId } = c.req.valid("param");
    const { tags } = c.req.valid("json");

    const canWrite = await hasContentPermissions(c.req.raw.headers, spaceId, "write");

    if (!canWrite) throw new HTTPException(401);

    await db
      .insertInto("pageTag")
      .values(tags.map((tagId) => ({ pageId, tagId })))
      .onConflict((oc) => oc.column("pageId").column("tagId").doNothing())
      .execute();

    await syncPageMetadata([pageId], "upsert");

    return c.body(null, 201);
  },
);
