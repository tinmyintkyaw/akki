import { db } from "@/db/kysely.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  const fileId = path.parse(req.params.fileId).name;
  const userId = res.locals.session.user.id;

  try {
    const dbFile = await db
      .selectFrom("File")
      .where("id", "=", fileId)
      .where("userId", "=", userId)
      .selectAll()
      .executeTakeFirstOrThrow();

    const filePath = path.join(
      process.cwd(),
      "uploads",
      dbFile.userId,
      dbFile.id,
    );

    await fs.stat(filePath);

    return res.sendFile(filePath);
  } catch (error) {
    return res.sendStatus(404);
  }
};

export const getFileController = asyncHandler(requestHandler);
