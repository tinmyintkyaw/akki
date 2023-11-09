import prisma from "@/configs/prisma-client-config";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageListResponseData } from "@/utils/transform-response-data.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const getDeletedPageListController: RequestHandler = async (_req, res) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

  const deletedPageList = await prisma.page.findMany({
    where: {
      userId: userId,
      isDeleted: true,
    },
    select: pageSelect,
    orderBy: {
      createdAt: "asc",
    },
  });

  const response = transformPageListResponseData(deletedPageList);

  return res.status(200).json(response);
};

export default asyncHandler(getDeletedPageListController);
