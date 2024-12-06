import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { user } = res.locals.session;

  const starredPageList = await db
    .selectFrom("Page")
    .select(selectArray)
    .where("userId", "=", user.id)
    .where("deletedAt", "is", null)
    .where("isStarred", "is", true)
    .orderBy("createdAt asc")
    .limit(10)
    .execute();

  return res.status(200).json(starredPageList);
};

export const getStarredPageListController = asyncHandler(requestHandler);
