import prisma from "@/configs/prisma-client-config";
import { Prisma } from "@prisma/client";
import { Request, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";

const getFileController: RequestHandler = async (
  req: Request<{ fileId: string }>,
  res,
) => {
  try {
    await prisma.file.findUniqueOrThrow({
      where: {
        id: path.parse(req.params.fileId).name,
        user_id: res.locals.session.user.userId,
      },
    });

    const filePath = path.join(
      process.cwd(),
      "uploads",
      res.locals.session.user.userId,
      req.params.fileId,
    );

    fs.statSync(filePath);

    return res.sendFile(filePath);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res.sendStatus(404);
  }
};

export default asyncHandler(getFileController);
