import prisma from "@/db/prisma-client.js";
import { typesenseClient } from "@/index.js";
import typesenseDocument from "@/shared/types/typesense-document.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { RequestHandler } from "express";
import * as Y from "yjs";

const createPageController: RequestHandler = async (req, res, next) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
    const newPage = await prisma.page.create({
      data: {
        userId: res.locals.session.user.userId,
        pageName: req.body.pageName,
        parentId: req.body.parentId,
        ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
        textContent: "",
      },
      select: pageSelect,
    });

    const typesensePage: typesenseDocument = {
      id: newPage.id,
      userId: newPage.userId,
      pageName: newPage.pageName,
      textContent: "",
      createdAt: newPage.createdAt.getTime(),
      modifiedAt: newPage.modifiedAt.getTime(),
      isStarred: newPage.isStarred,
    };

    await typesenseClient
      .collections("pages")
      .documents()
      .create(typesensePage);

    const response = transformPageResponseData(newPage);

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export default createPageController;
