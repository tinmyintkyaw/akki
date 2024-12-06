import { db } from "@/db/kysely.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { TypedRequestHandler } from "@/validation/request-validator.js";
import { CreatePagePayloadSchema } from "@/validation/schemas/page-schema.js";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { MeilisearchPage } from "@project/shared-types";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import asyncHandler from "express-async-handler";
import { sql } from "kysely";
import { ulid } from "ulidx";
import * as Y from "yjs";

type CreatePageControllerType = TypedRequestHandler<
  never,
  CreatePagePayloadSchema
>;

const defaultTiptapExtensions = [StarterKit, Link, TaskList, TaskItem, Image];

const requestHandler: CreatePageControllerType = async (req, res) => {
  const { user } = res.locals.session;
  const body = req.body;

  // const newPage = await createPage(body.parentId, body.pageName, userId);
  const newPageId = ulid().toLowerCase();
  const newYDoc = TiptapTransformer.toYdoc(
    generateJSON("<p></p>", defaultTiptapExtensions),
    "default",
    defaultTiptapExtensions,
  );

  const newPage = await db
    .insertInto("Page")
    .values(({ selectFrom }) => ({
      id: newPageId,
      userId: user.id,
      pageName: body.pageName,
      ydoc: Buffer.from(Y.encodeStateAsUpdate(newYDoc)),
      path: body.parentId
        ? selectFrom("Page as parent")
            .select(sql<string>`parent.path || ${newPageId}`.as("path"))
            .where("id", "=", body.parentId)
        : newPageId,
    }))
    .returningAll()
    .executeTakeFirstOrThrow();

  const meilisearchPage: MeilisearchPage = {
    id: newPage.id,
    userId: newPage.userId,
    pageName: newPage.pageName,
    textContent: [],
    isStarred: newPage.isStarred,
    createdAt: newPage.createdAt.getTime(),
    modifiedAt: newPage.modifiedAt.getTime(),
    deletedAt: newPage.deletedAt ? newPage.deletedAt.getTime() : false,
  };

  await meilisearchClient.index("pages").addDocuments([meilisearchPage]);

  return res.status(200).json(newPage);
};

export const createPageController = asyncHandler(requestHandler);
