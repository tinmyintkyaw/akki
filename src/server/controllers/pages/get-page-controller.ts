import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";

interface GetPageReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    pageId: string;
  };
}

const getPageController: RequestHandler = async (
  req: ValidatedRequest<GetPageReqSchema>,
  res,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const page = await prisma.page.findUnique({
    where: {
      id_userId: {
        userId: res.locals.session.user.userId,
        id: req.params.pageId,
      },
    },
    select: pageSelect,
  });

  if (!page) return res.sendStatus(404);

  const response = transformPageResponseData(page);

  return res.status(200).json(response);
};

export default asyncHandler(getPageController);
