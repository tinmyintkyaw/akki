import { TypedRequestHandler } from "@/middlewares/request-validator.js";
import {
  PageIdAsParamsSchema,
  UpdatePagePayloadSchema,
} from "@/schemas/page-schema.js";
import { transformPageForClient } from "@/services/page/transform-for-client.js";
import { updatePage } from "@/services/page/update-page.js";
import asyncHandler from "express-async-handler";

type EditPageControllerType = TypedRequestHandler<
  PageIdAsParamsSchema,
  UpdatePagePayloadSchema
>;

const requestHandler: EditPageControllerType = async (req, res) => {
  const { user } = res.locals.session;

  const updatedPage = await updatePage(
    req.params.pageId,
    user.userId,
    req.body,
  );
  const response = transformPageForClient(updatedPage);
  return res.status(200).json(response);
};

export const updatePageController = asyncHandler(requestHandler);
