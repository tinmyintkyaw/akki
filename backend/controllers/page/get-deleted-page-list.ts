import { getDeletedPageList } from "@/services/page/get-deleted-page-list.js";
import { transformPageListForClient } from "@/services/page/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { user } = res.locals.session;

  const deletedPageList = await getDeletedPageList(user.userId);
  const response = transformPageListForClient(deletedPageList);
  return res.status(200).json(response);
};

export const getDeletedPageListController = asyncHandler(requestHandler);
