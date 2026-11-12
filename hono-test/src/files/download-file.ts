import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { spaceFileIdSchema } from "./schema.js";

const app = new Hono();

app.get(
  "/spaces/:spaceId/files/:fileId",
  zValidator("param", spaceFileIdSchema),
  sessionMiddleware,
  async (c) => {
    const { spaceId, fileId } = c.req.valid("param");

    const canRead = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "read",
    );

    if (!canRead) throw new HTTPException(401);

    const dbFile = await db.transaction().execute(async (trx) => {
      return trx
        .selectFrom("file")
        .selectAll()
        .where("organizationId", "=", spaceId)
        .where("id", "=", fileId)
        .executeTakeFirst();
    });

    if (!dbFile) throw new HTTPException(400);

    const filePath = path.resolve(
      "uploads",
      spaceId.slice(0, 2),
      spaceId,
      dbFile.filename.slice(0, 2),
    );

    const nodeStream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    c.header(
      "Content-Disposition",
      `attachment; filename="${dbFile.originalFilename}"`,
    );

    return c.body(webStream);
  },
);

export default app;
