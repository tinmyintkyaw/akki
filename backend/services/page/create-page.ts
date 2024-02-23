import { db } from "@/configs/kysely.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { MeilisearchPage } from "@project/shared-types";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { sql } from "kysely";
import { ulid } from "ulidx";
import * as Y from "yjs";

const defaultTiptapExtensions = [StarterKit, Link, TaskList, TaskItem, Image];

export const createPage = async (
  parentId: string | null,
  pageName: string | undefined,
  userId: string,
) => {
  const newPageId = ulid().toLowerCase();
  const newYDoc = TiptapTransformer.toYdoc(
    generateJSON("<p></p>", defaultTiptapExtensions),
    "default",
    defaultTiptapExtensions,
  );

  const newPage = await db
    .insertInto("page")
    .values(({ selectFrom }) => ({
      id: newPageId,
      user_id: userId,
      page_name: pageName,
      ydoc: Buffer.from(Y.encodeStateAsUpdate(newYDoc)),
      path: parentId
        ? selectFrom("page as parent")
            .select(sql<string>`parent.path || ${newPageId}`.as("path"))
            .where("id", "=", parentId)
        : newPageId,
      accessed_at: new Date(),
      modified_at: new Date(),
    }))
    .returningAll()
    .executeTakeFirstOrThrow();

  const meilisearchPage: MeilisearchPage = {
    id: newPage.id,
    userId: newPage.user_id,
    pageName: newPage.page_name,
    textContent: [],
    isStarred: newPage.is_starred,
    createdAt: newPage.created_at.getTime(),
    modifiedAt: newPage.modified_at.getTime(),
    deletedAt: newPage.deleted_at ? newPage.deleted_at.getTime() : false,
  };

  await meilisearchClient.index("pages").addDocuments([meilisearchPage]);

  return newPage;
};
