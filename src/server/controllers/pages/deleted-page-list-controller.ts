import prisma from "@/configs/prisma-client-config";
import { pageSelect } from "@/utils/prisma-page-select";
import { transformPageListResponseData } from "@/utils/transform-response-data";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const getDeletedPageListController: RequestHandler = async (_req, res) => {
  if (!res.locals.session) return res.sendStatus(401);

  const { userId } = res.locals.session.user;

  const deletedPageList = await prisma.page.findMany({
    where: {
      user_id: userId,
      is_deleted: true,
    },
    select: pageSelect,
    orderBy: {
      created_at: "asc",
    },
  });

  const response = transformPageListResponseData(deletedPageList);

  return res.status(200).json(response);
};

export default asyncHandler(getDeletedPageListController);
