import prisma from "@/db/prisma-client.js";
import { typesenseClient } from "@/index.js";
import TypesenseDocument from "@/shared/types/typesense-document.js";
import { pageSelect } from "@/utils/prisma-page-select.js";
import { transformPageResponseData } from "@/utils/transform-response-data.js";
import { TiptapTransformer } from "@hocuspocus/transformer";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { RequestHandler } from "express";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";
import * as Y from "yjs";

interface CreatePageReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    pageName: string;
    parentId: string;
  };
}

const defaultTiptapExtensions = [
  StarterKit.configure({
    history: false,
  }),
  Link,
  TaskList,
  TaskItem.configure({ nested: true }),
  Image,
];

const createPageController: RequestHandler = async (
  req: ValidatedRequest<CreatePageReqSchema>,
  res,
  next,
) => {
  if (!res.locals.session) return res.sendStatus(401);

  try {
    const newYDoc = TiptapTransformer.toYdoc(
      generateJSON("<p></p>", defaultTiptapExtensions),
      "default",
      defaultTiptapExtensions,
    );

    const newPage = await prisma.page.create({
      data: {
        userId: res.locals.session.user.userId,
        pageName: req.body.pageName,
        parentId: req.body.parentId,
        ydoc: Buffer.from(Y.encodeStateAsUpdate(newYDoc)),
        textContent: "",
      },
      select: pageSelect,
    });

    const typesensePage: TypesenseDocument = {
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
