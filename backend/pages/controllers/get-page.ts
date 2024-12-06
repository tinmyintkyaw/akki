import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { TypedRequestHandler } from "@/validation/request-validator.js";
import { PageIdAsParamsSchema } from "@/validation/schemas/page-schema.js";
import asyncHandler from "express-async-handler";

type GetPageControllerType = TypedRequestHandler<PageIdAsParamsSchema, never>;

const requestHandler: GetPageControllerType = async (req, res) => {
  const { user } = res.locals.session;

  const page = await db
    .selectFrom("Page")
    .select(selectArray)
    .where("id", "=", req.params.pageId)
    .where("userId", "=", user.id)
    .executeTakeFirst();

  if (!page) {
    return res.sendStatus(404);
  } else {
    return res.status(200).json(page);
  }
};

export const getPageController = asyncHandler(requestHandler);
