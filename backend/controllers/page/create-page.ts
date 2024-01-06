import { TypedRequestHandler } from "@/middlewares/request-validator.js";
import { CreatePagePayloadSchema } from "@/schemas/page-schema.js";
import { createPage } from "@/services/page/create-page.js";
import { transformPageForClient } from "@/services/page/transform-for-client.js";
import asyncHandler from "express-async-handler";

type CreatePageControllerType = TypedRequestHandler<
  never,
  CreatePagePayloadSchema
>;

const requestHandler: CreatePageControllerType = async (req, res) => {
  const { user } = res.locals.session;
  const body = req.body;

  const newPage = await createPage(body.parentId, body.pageName, user.userId);
  const response = transformPageForClient(newPage);
  return res.status(200).json(response);
};

export const createPageController = asyncHandler(requestHandler);
