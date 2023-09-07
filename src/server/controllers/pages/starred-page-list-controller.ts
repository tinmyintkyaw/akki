import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { RequestHandler } from "express";

const getStarredPageListController: RequestHandler = async (req, res, next) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

  try {
    const starredPageList = await prisma.page.findMany({
      where: {
        userId: userId,
        isDeleted: false,
        isFavourite: true,
      },
      select: pageSelect,
      orderBy: {
        createdAt: "asc",
      },
    });

    const response = starredPageList.map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Page, ...response } = {
        ...page,
        childPages: page.childPages.map((page) => page.id),
        parentPageName: page.Page ? page.Page.pageName : null,
      };

      return response;
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default getStarredPageListController;
