import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { sessionMiddleware } from "#/auth/session-middleware.js";
import { db } from "#/db/db.js";
import { spaceIdSchema } from "#/pages/schemas.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

const app = new Hono();

const MAX_FILE_SIZE = 50 * 1024 * 1024;

app.post(
  "/spaces/:spaceId/files",
  zValidator("param", spaceIdSchema),
  bodyLimit({ maxSize: MAX_FILE_SIZE, onError: (c) => c.body(null, 413) }),
  sessionMiddleware,
  async (c) => {
    const { spaceId } = c.req.valid("param");
    const { session } = c.get("session");

    const canWrite = await hasContentPermissions(
      c.req.raw.headers,
      spaceId,
      "write",
    );

    if (!canWrite) throw new HTTPException(401);

    // parse multipart/form-data
    const body = await c.req.parseBody();
    const file = body["file"];

    if (!(file instanceof File)) throw new HTTPException(400);

    const safeFilename = path.basename(file.name);

    const storedFilename = `${crypto.randomUUID()}-${path.basename(file.name)}`;

    const destinationPath = path.resolve(
      "uploads",
      spaceId.slice(0, 2),
      spaceId,
      storedFilename.slice(0, 2),
      storedFilename,
    );

    await mkdir(path.dirname(destinationPath), { recursive: true });

    const writeStream = createWriteStream(destinationPath);

    await pipeline(file.stream(), writeStream);

    const newFile = await db
      .insertInto("file")
      .values({
        filename: storedFilename,
        originalFilename: safeFilename,
        organizationId: spaceId,
        createdBy: session.userId,
      })
      .returningAll()
      .executeTakeFirst();

    if (!newFile) throw new HTTPException(400);
    return c.json(newFile, 201);
  },
);

export default app;
