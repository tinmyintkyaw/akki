import prisma from "@/configs/prisma-client-config";
import { Prisma } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import { RequestHandler } from "http-proxy-middleware";
import path from "path";

const deleteFileController: RequestHandler = async (req, res) => {
  const fileNameObj = path.parse(req.params.fileName);

  try {
    const fileToDel = await prisma.file.delete({
      where: {
        id: fileNameObj.name,
      },
    });

    const filePath = path.join(
      process.cwd(),
      "uploads",
      res.locals.session.user.userId,
      `${fileToDel.id}${path.extname(fileToDel.file_name)}`,
    );

    fs.unlinkSync(filePath);

    return res.sendStatus(204);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return res.sendStatus(404);
  }
};

export default expressAsyncHandler(deleteFileController);
