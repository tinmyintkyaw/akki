import prisma from "@/db/prisma-client.js";
import { pageSelectWithTextContent } from "@/utils/prisma-page-select.js";
import { Request, RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";

const editPageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.mapped());

  const payload = matchedData(req);

  //   return res.status(200).json(payload);

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

    if (typeof payload.isDeleted !== "undefined") {
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Page, ...response } = {
      ...updatedPage,
      childPages: updatedPage.childPages.map((page) => page.id),
      parentPageName: updatedPage.Page ? updatedPage.pageName : null,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default editPageController;
