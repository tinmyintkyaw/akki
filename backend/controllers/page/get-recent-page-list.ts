import { getRecentPageList } from "@/services/page/get-page-list.js";
import { transformPageListForClient } from "@/services/page/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { user } = res.locals.session;

  const recentPageList = await getRecentPageList(user.userId);
  const response = transformPageListForClient(recentPageList);
  return res.status(200).json(response);
};

export const getRecentPageListController = asyncHandler(requestHandler);
