import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageListForClient } from "@/pages/utils/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { userId } = res.locals.session;

  const deletedPageList = await db
    .selectFrom("page")
    .select(selectArray)
    .where("user_id", "=", userId)
    .where("deleted_at", "is not", null)
    .orderBy("deleted_at desc")
    .execute();

  const response = transformPageListForClient(deletedPageList);
  return res.status(200).json(response);
};

export const getDeletedPageListController = asyncHandler(requestHandler);
