import prisma from "@/configs/prisma-client-config";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const getRecentPageListController: RequestHandler = async (_req, res) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

  const recentPageList = await prisma.page.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    orderBy: {
      accessedAt: "desc",
    },
    take: 10,
    select: pageSelect,
  });

  const response = recentPageList.map((page) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Page, ...response } = {
      ...page,
      childPages: page.childPages.map((page) => page.id),
      parentPageName: page.Page ? page.Page.pageName : null,
    };

    return response;
  });

  return res.status(200).json(response);
};

export default asyncHandler(getRecentPageListController);
