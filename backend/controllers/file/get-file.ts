import { getFile } from "@/services/file/get-file.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

const requestHandler: RequestHandler = async (req, res) => {
  const fileId = path.parse(req.params.fileId).name;
  const userId = res.locals.session.user.userId;

  try {
    const filePath = await getFile(fileId, userId);
    return res.sendFile(filePath);
  } catch (error) {
    return res.sendStatus(404);
  }
};

export const getFileController = asyncHandler(requestHandler);
