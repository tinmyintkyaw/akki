import meilisearchClient from "@/configs/meilisearch-client-config";
import prisma from "@/configs/prisma-client-config";
import MeilisearchPage from "@/shared/types/meilisearch-page";
import { storePayload } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { JSONContent, generateText } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";

const isJSONContent = (json: unknown): json is JSONContent => {
  return (json as JSONContent) !== undefined;
};

const storePageHandler = async (data: storePayload) => {
  try {
    const { default: json } = await TiptapTransformer.fromYdoc(data.document);

    if (!isJSONContent(json)) throw new Error("Invalid JSON");
    if (!json.content) throw new Error("Invalid content");

    const textContent = generateText(json, [
      StarterKit.configure({
        history: false,
      }),
      Link,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
    ]);

    const dbPage = await prisma.page.update({
      where: {
        id_user_id: {
          user_id: data.context.userId,
          id: data.documentName,
        },
      },
      data: {
        ydoc: data.state,
        modified_at: new Date(),
      },
    });

    // Update meilisearch index
    const meilisearchPage: MeilisearchPage = {
      id: dbPage.id,
      userId: dbPage.user_id,
      pageName: dbPage.page_name,
      textContent: textContent,
      createdAt: dbPage.created_at.getTime(),
      modifiedAt: dbPage.modified_at.getTime(),
      isStarred: dbPage.is_starred,
    };

    await meilisearchClient.index("pages").updateDocuments([meilisearchPage]);
  } catch (error) {
    throw new Error("Failed to store page");
  }
};

export default storePageHandler;
