import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageListResponseData } from "@/utils/transform-response-data.js";
import { RequestHandler } from "express";

const getPageListController: RequestHandler = async (req, res) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

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
};

export default getPageListController;
