import { uploadFile } from "@/services/file/upload-file.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  if (!req.file) return res.sendStatus(400);

  const pageId = req.body.pageId;
  const fileUID = path.parse(req.file.filename).name;
  const userId = res.locals.session.user.userId;
  const originalName = req.file.originalname;

  const file = await uploadFile(fileUID, originalName, pageId, userId);

  const url = `${req.headers.host}/api/files/${file.file_name}.${file.extension}`;

  return res.status(200).json({ url });
};

export const uploadFileController = asyncHandler(requestHandler);
