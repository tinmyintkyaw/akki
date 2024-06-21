import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageForClient } from "@/pages/utils/transform-for-client.js";
import { TypedRequestHandler } from "@/validation/request-validator.js";
import { PageIdAsParamsSchema } from "@/validation/schemas/page-schema.js";
import asyncHandler from "express-async-handler";

type GetPageControllerType = TypedRequestHandler<PageIdAsParamsSchema, never>;

const requestHandler: GetPageControllerType = async (req, res) => {
  const { userId } = res.locals.session;

  const page = await db
    .selectFrom("page")
    .select(selectArray)
    .where("id", "=", req.params.pageId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!page) {
    return res.sendStatus(404);
  } else {
    const response = transformPageForClient(page);
    return res.status(200).json(response);
  }
};

export const getPageController = asyncHandler(requestHandler);
