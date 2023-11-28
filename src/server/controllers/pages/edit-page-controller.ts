import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";
import TypesenseDocument from "@/shared/types/typesense-document";
import { pageSelect } from "@/utils/prisma-page-select";
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
      id_user_id: {
        user_id: res.locals.session.user.userId,
        id: req.params.pageId,
      },
    },
    data: {
      page_name: req.body.pageName,
      parent_id: req.body.parentId,
      modified_at: new Date(),
      is_starred: req.body.isStarred,
      is_deleted: req.body.isDeleted,
      deleted_at: req.body.isDeleted ? new Date() : null,
      accessed_at: req.body.accessedAt
        ? new Date(Date.parse(req.body.accessedAt))
        : undefined,
    },
    select: pageSelect,
  });

  await prisma.page.updateMany({
    where: {
      user_id: res.locals.session.user.userId,
      parent_id: req.params.pageId,
    },
    data: {
      is_deleted: req.body.isDeleted,
      deleted_at: req.body.isDeleted ? new Date() : null,
    },
  });

  /* Update pages in typesense */
  const typesensePage: TypesenseDocument = {
    id: updatedPage.id,
    userId: updatedPage.user_id,
    pageName: updatedPage.page_name,
    createdAt: updatedPage.created_at.getTime(),
    modifiedAt: updatedPage.modified_at.getTime(),
    isStarred: updatedPage.is_starred,
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

    updatedPage.child_pages.forEach(async (page) => {
      await typesenseClient.collections("pages").documents(page.id).delete();
    });
  } else {
    await typesenseClient
      .collections("pages")
      .documents()
      .upsert(typesensePage);

    if (updatedPage.child_pages.length > 0) {
      await typesenseClient
        .collections("pages")
        .documents()
        .import(
          updatedPage.child_pages.map((page) => ({
            id: page.id,
            userId: page.user_id,
            pageName: page.page_name,
            createdAt: page.created_at.getTime(),
            modifiedAt: page.modified_at.getTime(),
            isStarred: page.is_starred,
          })),
        );
    }
  }

  const response = transformPageResponseData(updatedPage);

  return res.status(200).json(response);
};

export default asyncHandler(editPageController);
