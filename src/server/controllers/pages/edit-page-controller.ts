import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";
import TypesenseDocument from "@/shared/types/typesense-document";
import { pageSelectWithTextContent } from "@/utils/prisma-page-select";
import { transformPageResponseData } from "@/utils/transform-response-data";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";

interface EditPageReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    pageId: string;
  };
  [ContainerTypes.Body]: {
    pageName?: string;
    parentId?: string;
    isStarred?: boolean;
    isDeleted?: boolean;
    accessedAt?: string;
  };
}

const editPageController: RequestHandler = async (
  req: ValidatedRequest<EditPageReqSchema>,
  res,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const updatedPage = await prisma.page.update({
    where: {
      id_userId: {
        userId: res.locals.session.user.userId,
        id: req.params.pageId,
      },
    },
    data: {
      pageName: req.body.pageName,
      parentId: req.body.parentId,
      modifiedAt: new Date(),
      isStarred: req.body.isStarred,
      isDeleted: req.body.isDeleted,
      deletedAt: req.body.isDeleted ? new Date() : null,
      accessedAt: req.body.accessedAt
        ? new Date(Date.parse(req.body.accessedAt))
        : undefined,
    },
    select: pageSelectWithTextContent,
  });

  await prisma.page.updateMany({
    where: {
      userId: res.locals.session.user.userId,
      parentId: req.params.pageId,
    },
    data: {
      isDeleted: req.body.isDeleted,
      deletedAt: req.body.isDeleted ? new Date() : null,
    },
  });

  /* Update pages in typesense */
  const typesensePage: TypesenseDocument = {
    id: updatedPage.id,
    userId: updatedPage.userId,
    pageName: updatedPage.pageName,
    textContent: updatedPage.textContent,
    createdAt: updatedPage.createdAt.getTime(),
    modifiedAt: updatedPage.modifiedAt.getTime(),
    isStarred: updatedPage.isStarred,
  };

  if (req.body.isDeleted === undefined) {
    await typesenseClient
      .collections("pages")
      .documents()
      .update(typesensePage, {});
  } else if (req.body.isDeleted) {
    await typesenseClient
      .collections("pages")
      .documents(updatedPage.id)
      .delete();

    updatedPage.childPages.forEach(async (page) => {
      await typesenseClient.collections("pages").documents(page.id).delete();
    });
  } else {
    await typesenseClient
      .collections("pages")
      .documents()
      .upsert(typesensePage);

    if (updatedPage.childPages.length > 0) {
      await typesenseClient
        .collections("pages")
        .documents()
        .import(
          updatedPage.childPages.map((page) => ({
            id: page.id,
            userId: page.userId,
            pageName: page.pageName,
            textContent: page.textContent,
            createdAt: page.createdAt.getTime(),
            modifiedAt: page.modifiedAt.getTime(),
            isStarred: page.isStarred,
          })),
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { textContent, ...stripped } = updatedPage;

  const response = transformPageResponseData(stripped);

  return res.status(200).json(response);
};

export default asyncHandler(editPageController);
