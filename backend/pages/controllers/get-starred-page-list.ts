import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageListForClient } from "@/pages/utils/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { userId } = res.locals.session;

  const starredPageList = await db
    .selectFrom("page")
    .select(selectArray)
    .where("user_id", "=", userId)
    .where("deleted_at", "is", null)
    .where("is_starred", "is", true)
    .orderBy("created_at asc")
    .limit(10)
    .execute();

  const response = transformPageListForClient(starredPageList);

  return res.status(200).json(response);
};

export const getStarredPageListController = asyncHandler(requestHandler);
