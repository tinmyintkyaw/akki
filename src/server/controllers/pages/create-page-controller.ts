import prisma from "@/db/prisma-client.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";

// interface CreatePagePayload {
//   pageName: string;
//   parentId: string | null | undefined;
// }

const createPageController: RequestHandler = async (req, res, next) => {
  if (!res.locals.session) return res.sendStatus(401);

  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.mapped());

  const payload = matchedData(req);

  try {
    const newPage = await prisma.page.create({
      data: {
        userId: res.locals.session.user.userId,
        pageName: payload.pageName,
        parentId: payload.parentId,
        // ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
        textContent: "",
      },
      select: pageSelect,
    });

    return res.status(201).json(newPage);
  } catch (error) {
    next(error);
  }

  return res.status(200).json(matchedData(req));
};

export default createPageController;
