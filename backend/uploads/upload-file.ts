import { db } from "@/db/kysely.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  if (!req.file) return res.sendStatus(400);

  const pageId = req.body.pageId;
  const fileUID = path.parse(req.file.filename).name;
  const userId = res.locals.session.user.id;
  const originalName = req.file.originalname;

  const parsedFileName = path.parse(fileUID);
  const file = await db
    .insertInto("File")
    .values({
      id: parsedFileName.name,
      extension: parsedFileName.ext,
      fileName: originalName,
      pageId: pageId,
      userId: userId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const url = `${req.headers.host}/api/files/${file.fileName}.${file.extension}`;

  return res.status(200).json({ url });
};

export const uploadFileController = asyncHandler(requestHandler);
