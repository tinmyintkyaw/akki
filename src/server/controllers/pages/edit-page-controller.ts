import prisma from "@/db/prisma-client.js";
import { typesenseClient } from "@/index.js";
import typesenseDocument from "@/shared/types/typesense-document.js";
import { pageSelectWithTextContent } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { Request, RequestHandler } from "express";

const editPageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
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
        deletedAt: req.body.isDeleted ? new Date() : undefined,
        accessedAt: req.body.accessedAt
          ? new Date(Date.parse(req.body.accessedAt))
          : undefined,
      },
      select: pageSelectWithTextContent,
    });

    await prisma.page.updateMany({
      where: {
        userId: res.locals.session.user.userId,
        parentId: req.body.pageId,
      },
      data: {
        isDeleted: req.body.isDeleted,
        deletedAt: req.body.isDeleted ? new Date() : undefined,
      },
    });

    /* Update pages in typesense */
    const typesensePage: typesenseDocument = {
      id: updatedPage.id,
      userId: updatedPage.userId,
      pageName: updatedPage.pageName,
      textContent: updatedPage.textContent,
      createdAt: updatedPage.createdAt.getTime(),
      modifiedAt: updatedPage.modifiedAt.getTime(),
      isStarred: updatedPage.isStarred,
    };

    await typesenseClient
      .collections("pages")
      .documents()
      .update(typesensePage);

    if (typeof req.body.isDeleted !== "undefined") {
      if (req.body.isDeleted) {
        await typesenseClient
          .collections("pages")
          .documents(updatedPage.id)
          .delete();

        updatedPage.childPages.forEach(async (page) => {
          await typesenseClient
            .collections("pages")
            .documents(page.id)
            .delete();
        });
      } else {
        await typesenseClient
          .collections("pages")
          .documents()
          .upsert(typesensePage);

        const typesensePageList: typesenseDocument[] =
          updatedPage.childPages.map((page) => ({
            id: page.id,
            userId: page.userId,
            pageName: page.pageName,
            textContent: page.textContent,
            createdAt: page.createdAt.getTime(),
            modifiedAt: page.modifiedAt.getTime(),
            isStarred: page.isStarred,
          }));

        await typesenseClient
          .collections("pages")
          .documents()
          .import(typesensePageList);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { textContent, ...stripped } = updatedPage;

    const response = transformPageResponseData(stripped);

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default editPageController;
