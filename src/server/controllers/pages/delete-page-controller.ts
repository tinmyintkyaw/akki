import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { Request, RequestHandler } from "express";

const deletePageController: RequestHandler = async (
  req: Request<{ pageId: string }>,
  res,
  next
) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
    await prisma.page.delete({
      where: {
        id_userId: {
          userId: res.locals.session.user.userId,
          id: req.params.pageId,
        },
      },
      select: pageSelect,
    });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default deletePageController;
