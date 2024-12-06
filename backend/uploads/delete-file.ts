import { db } from "@/db/kysely.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  const { name: fileId } = path.parse(req.params.fileName);

  const userId = res.locals.session.user.id;

  const file = await db
    .deleteFrom("File")
    .where("id", "=", fileId)
    .where("userId", "=", userId)
    .returningAll()
    .executeTakeFirstOrThrow();

  const filePath = path.join(
    process.cwd(),
    "uploads",
    userId,
    `${file.id}.${file.extension}`,
  );

  fs.unlink(filePath);

  res.sendStatus(204);
};

export const deleteFileController = asyncHandler(requestHandler);
