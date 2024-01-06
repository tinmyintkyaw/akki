import { TypedRequestHandler } from "@/middlewares/request-validator.js";
import { PageIdAsParamsSchema } from "@/schemas/page-schema.js";
import { deletePage } from "@/services/page/delete-page.js";
import asyncHandler from "express-async-handler";

type DeletePageControllerType = TypedRequestHandler<
  PageIdAsParamsSchema,
  never
>;

const requestHandler: DeletePageControllerType = async (req, res) => {
  const { user } = res.locals.session;
  await deletePage(req.params.pageId, user.userId);
  return res.sendStatus(204);
};

export const deletePageController = asyncHandler(requestHandler);
