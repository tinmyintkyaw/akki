import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { Request, RequestHandler } from "express";
import path from "path";
import fs from "fs";
import { typesenseClient } from "@/index.js";

const deletePageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next
) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
    const deletedPage = await prisma.page.delete({
      where: {
        id_userId: {
          userId: res.locals.session.user.userId,
          id: req.params.pageId,
        },
      },
      select: pageSelect,
    });

    const uploadDir = path.join(
      process.env.UPLOAD_DIR,
      res.locals.session.user.userId
    );

    deletedPage.files.forEach(async (file) => {
      fs.rmSync(path.join(uploadDir, file.fileName));
    });

    await typesenseClient
      .collections("pages")
      .documents(deletedPage.id)
      .delete();

    deletedPage.childPages.forEach(async (page) => {
      await typesenseClient.collections("pages").documents(page.id).delete();
    });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default deletePageController;
