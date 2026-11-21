import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import fs from "node:fs";
import path from "node:path";
import { spaceFileIdSchema } from "./schema.js";

const app = new Hono();

app.delete(
  "/spaces/:spaceId/files/:fileId",
  zValidator("param", spaceFileIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, fileId } = c.req.valid("param");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    const deletedFile = await db.transaction().execute(async (trx) => {
      const fileToDel = await trx
        .selectFrom("file")
        .selectAll()
        .where("organizationId", "=", spaceId)
        .where("id", "=", fileId)
        .executeTakeFirstOrThrow();

      const filePath = path.resolve(
        "uploads",
        spaceId.slice(0, 2),
        spaceId,
        fileToDel.filename.slice(0, 2),
      );

      await fs.promises.rm(filePath);

      return await trx
        .deleteFrom("file")
        .where("organizationId", "=", spaceId)
        .where("id", "=", fileId)
        .returningAll()
        .executeTakeFirst();
    });

    if (!deletedFile) throw new HTTPException(400);

    return c.body(null, 204);
  },
);

export default app;
