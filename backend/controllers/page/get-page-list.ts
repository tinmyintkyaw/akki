import { getPageList } from "@/services/page/get-page-list.js";
import { transformPageListForClient } from "@/services/page/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { user } = res.locals.session;

  const pageList = await getPageList(user.userId);
  const response = transformPageListForClient(pageList);
  return res.status(200).json(response);
};

export const getPageListController = asyncHandler(requestHandler);
