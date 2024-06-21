import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageListForClient } from "@/pages/utils/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { userId } = res.locals.session;

  const recentPageList = await db
    .selectFrom("page")
    .select(selectArray)
    .where("user_id", "=", userId)
    .where("deleted_at", "is", null)
    .orderBy("accessed_at desc")
    .limit(10)
    .execute();

  const response = transformPageListForClient(recentPageList);
  return res.status(200).json(response);
};

export const getRecentPageListController = asyncHandler(requestHandler);
