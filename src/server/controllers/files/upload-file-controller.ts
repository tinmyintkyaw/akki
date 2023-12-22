import prisma from "@/configs/prisma-client-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

const uploadFileController: RequestHandler = async (req, res) => {
  const pageId = req.body.pageId;
  const fileUID = path.parse(req.file.filename).name;
  const userId = res.locals.session.user.userId;
  const originalName = req.file.originalname;

  await prisma.file.create({
    data: {
      id: fileUID,
      user_id: userId,
      page_id: pageId,
      file_name: originalName,
    },
  });

  const url = `${req.headers.host}/api/files/${req.file.filename}`;

  return res.status(200).json({ url });
};

export default asyncHandler(uploadFileController);
