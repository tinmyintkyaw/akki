import meilisearchClient from "@/configs/meilisearch-client-config";
import prisma from "@/configs/prisma-client-config";
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

  await meilisearchClient.index("pages").deleteDocument(deletedPage.id);

  if (deletedPage.child_pages.length > 0) {
    await meilisearchClient
      .index("pages")
      .deleteDocuments(deletedPage.child_pages.map((page) => page.id));
  }

  return res.sendStatus(204);
};

export default asyncHandler(deletePageController);
