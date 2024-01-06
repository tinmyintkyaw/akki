import { db } from "@/configs/kysely.js";
import { storePayload } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { JSONContent, getSchema } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Node } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";

const flattenNodes = (node: Node) => {
  if (!node) return null;

  type Result = { posStart: number; posEnd: number; text: string }[];
  const result: Result = [];
  node.descendants((child, pos) => {
    if (!child.text) return false;

    result.push({
      posStart: pos,
      posEnd: pos + child.nodeSize,
      text: child.text,
    });
  });
  return result;
};

const isJSONContent = (json: unknown): json is JSONContent => {
  return (json as JSONContent) !== undefined;
};

const pmSchema = getSchema([
  StarterKit.configure({
    history: false,
  }),
  Link,
  TaskList,
  TaskItem.configure({ nested: true }),
  Image,
]);

export const storePageHandler = async (data: storePayload) => {
  try {
    const { default: pmJSON } = await TiptapTransformer.fromYdoc(data.document);

    if (!isJSONContent(pmJSON)) throw new Error("Invalid JSON");
    if (!pmJSON.content) throw new Error("Invalid content");

    const pmDoc = Node.fromJSON(pmSchema, pmJSON);
    const flattenedDoc = flattenNodes(pmDoc);

    await db
      .updateTable("page")
      .where("user_id", "=", data.context.uesrId)
      .where("id", "=", data.documentName)
      .set({ ydoc: data.state })
      .executeTakeFirstOrThrow();

    // Update Meilisearch index
  } catch (error) {
    throw new Error("Failed to store page");
  }
};
