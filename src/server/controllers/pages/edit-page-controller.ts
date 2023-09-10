import prisma from "@/db/prisma-client.js";
import { typesenseClient } from "@/index.js";
import typesenseDocument from "@/types/typesense-document.js";
import { pageSelectWithTextContent } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { Request, RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";

const editPageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.mapped());

  const payload = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true,
  });

  try {
    const updatedPage = await prisma.page.update({
      where: {
        id_userId: {
          userId: res.locals.session.user.userId,
          id: req.params.pageId,
        },
      },
      data: {
        pageName: payload.pageName,
        parentId: payload.parentId,
        modifiedAt: new Date(),
        isFavourite: payload.isFavourite,
        isDeleted: payload.isDeleted,
        deletedAt: payload.isDeleted ? new Date() : undefined,
        accessedAt: new Date(Date.parse(payload.accessedAt)),
      },
      select: pageSelectWithTextContent,
    });

    await prisma.page.updateMany({
      where: {
        userId: res.locals.session.user.userId,
        parentId: payload.pageId,
      },
      data: {
        isDeleted: payload.isDeleted,
        deletedAt: payload.isDeleted ? new Date() : undefined,
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
      isFavourite: updatedPage.isFavourite,
    };

    await typesenseClient
      .collections("pages")
      .documents()
      .upsert(typesensePage);

    if (updatedPage.isDeleted) {
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

      const typesensePageList: typesenseDocument[] = updatedPage.childPages.map(
        (page) => ({
          id: page.id,
          userId: page.userId,
          pageName: page.pageName,
          textContent: page.textContent,
          createdAt: page.createdAt.getTime(),
          modifiedAt: page.modifiedAt.getTime(),
          isFavourite: page.isFavourite,
        }),
      );

      await typesenseClient
        .collections("pages")
        .documents()
        .createMany(typesensePageList);
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
