import { deleteFile } from "@/services/file/delete-file.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  const { name } = path.parse(req.params.fileName);
  const userId = res.locals.session.user.userId;

  await deleteFile(name, userId);

  res.sendStatus(204);
};

export const deleteFileController = asyncHandler(requestHandler);
