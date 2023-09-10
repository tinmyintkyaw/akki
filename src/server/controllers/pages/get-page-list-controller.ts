import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageListResponseData } from "@/utils/transform-response-data.js";
import { RequestHandler } from "express";

const getPageListController: RequestHandler = async (req, res, next) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

  try {
    const pagesList = await prisma.page.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
      select: pageSelect,
      orderBy: {
        createdAt: "asc",
      },
    });

    const response = transformPageListResponseData(pagesList);

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default getPageListController;
