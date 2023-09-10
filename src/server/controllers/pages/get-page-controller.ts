import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { Request, RequestHandler } from "express";

const getPageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
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
  } catch (error) {
    next(error);
  }
};

export default getPageController;
