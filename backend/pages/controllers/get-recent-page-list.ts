import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { user } = res.locals.session;

  const recentPageList = await db
    .selectFrom("Page")
    .select(selectArray)
    .where("userId", "=", user.id)
    .where("deletedAt", "is", null)
    .orderBy("accessedAt desc")
    .limit(10)
    .execute();

  return res.status(200).json(recentPageList);
};

export const getRecentPageListController = asyncHandler(requestHandler);
