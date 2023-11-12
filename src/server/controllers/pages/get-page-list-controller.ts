import prisma from "@/configs/prisma-client-config";
import { pageSelect } from "@/utils/prisma-page-select";
import { transformPageListResponseData } from "@/utils/transform-response-data";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

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

export default asyncHandler(getPageListController);
