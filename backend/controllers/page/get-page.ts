import { TypedRequestHandler } from "@/middlewares/request-validator.js";
import { PageIdAsParamsSchema } from "@/schemas/page-schema.js";
import { getPage } from "@/services/page/get-page.js";
import { transformPageForClient } from "@/services/page/transform-for-client.js";
import asyncHandler from "express-async-handler";

type GetPageControllerType = TypedRequestHandler<PageIdAsParamsSchema, never>;

const requestHandler: GetPageControllerType = async (req, res) => {
  const { user } = res.locals.session;
  const page = await getPage(req.params.pageId, user.userId);

  if (!page) {
    return res.sendStatus(404);
  } else {
    const response = transformPageForClient(page);
    return res.status(200).json(response);
  }
};

export const getPageController = asyncHandler(requestHandler);
