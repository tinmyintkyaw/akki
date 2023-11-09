import prisma from "@/configs/prisma-client-config";
import { typesenseClient } from "@/index.js";
import TypesenseDocument from "@/shared/types/typesense-document";
import { storePayload } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { JSONContent, generateText } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

const isJSONContent = (json: unknown): json is JSONContent => {
  return (json as JSONContent) !== undefined;
};

const storePageHandler = async (data: storePayload) => {
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
      id_userId: {
        userId: data.context.userId,
        id: data.documentName,
      },
    },
    data: {
      ydoc: data.state,
      modifiedAt: new Date(),
      textContent: textContent,
    },
  });

  // Update typesense index
  const typesensePage: TypesenseDocument = {
    id: dbPage.id,
    userId: dbPage.userId,
    pageName: dbPage.pageName,
    textContent: dbPage.textContent,
    createdAt: dbPage.createdAt.getTime(),
    modifiedAt: dbPage.modifiedAt.getTime(),
    isStarred: dbPage.isStarred,
  };

  await typesenseClient.collections("pages").documents().upsert(typesensePage);

  // data.document.broadcastStateless("synced!");
};

export default storePageHandler;
