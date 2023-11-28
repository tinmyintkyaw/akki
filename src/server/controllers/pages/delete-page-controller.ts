import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";
import { pageSelect } from "@/utils/prisma-page-select";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";
import fs from "fs";
import path from "path";

interface DeletePageReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    pageId: string;
  };
}

const deletePageController: RequestHandler = async (
  req: ValidatedRequest<DeletePageReqSchema>,
  res,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const deletedPage = await prisma.page.delete({
    where: {
      id_user_id: {
        user_id: res.locals.session.user.userId,
        id: req.params.pageId,
      },
    },
    select: pageSelect,
  });

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    res.locals.session.user.userId,
  );

  deletedPage.files.forEach(async (file) => {
    fs.rmSync(path.join(uploadDir, file.file_name));
  });

  await typesenseClient.collections("pages").documents(deletedPage.id).delete();

  deletedPage.child_pages.forEach(async (page) => {
    await typesenseClient.collections("pages").documents(page.id).delete();
  });

  return res.sendStatus(204);
};

export default asyncHandler(deletePageController);
