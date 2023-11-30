import meilisearchClient from "@/configs/meilisearch-client-config";
import prisma from "@/configs/prisma-client-config";
import MeilisearchPage from "@/shared/types/meilisearch-page";
import { pageSelect } from "@/utils/prisma-page-select";
import { transformPageResponseData } from "@/utils/transform-response-data";
import { TiptapTransformer } from "@hocuspocus/transformer";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
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
) => {
  if (!res.locals.session) return res.sendStatus(401);

  const newYDoc = TiptapTransformer.toYdoc(
    generateJSON("<p></p>", defaultTiptapExtensions),
    "default",
    defaultTiptapExtensions,
  );

  const newPage = await prisma.page.create({
    data: {
      user_id: res.locals.session.user.userId,
      page_name: req.body.pageName,
      parent_id: req.body.parentId,
      ydoc: Buffer.from(Y.encodeStateAsUpdate(newYDoc)),
      text_content: "",
    },
    select: pageSelect,
  });

  const meilisearchPage: MeilisearchPage = {
    id: newPage.id,
    userId: newPage.user_id,
    pageName: newPage.page_name,
    textContent: "",
    createdAt: newPage.created_at.getTime(),
    modifiedAt: newPage.modified_at.getTime(),
    isStarred: newPage.is_starred,
    isDeleted: newPage.is_deleted,
  };

  await meilisearchClient.index("pages").addDocuments([meilisearchPage]);

  const response = transformPageResponseData(newPage);

  return res.status(201).json(response);
};

export default asyncHandler(createPageController);
