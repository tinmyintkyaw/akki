import { TiptapTransformer } from "@hocuspocus/transformer";
import { JSONContent, getSchema } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Node } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { Doc } from "yjs";

const flattenNodes = (node: Node) => {
  if (!node) return null;

  type Result = { posStart: number; posEnd: number; text: string }[];
  const result: Result = [];
  node.descendants((node, pos) => {
    if (!node.text) return;

    result.push({
      posStart: pos,
      posEnd: pos + node.nodeSize,
      text: node.text,
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

const ydocToTextContent = async (ydoc: Doc) => {
  const { default: pmJSON } = await TiptapTransformer.fromYdoc(ydoc);

  if (!isJSONContent(pmJSON)) throw new Error("Invalid JSON");
  if (!pmJSON.content) throw new Error("Invalid content");

  const pmDoc = Node.fromJSON(pmSchema, pmJSON);
  const flattenedDoc = flattenNodes(pmDoc);

  if (!flattenedDoc) throw new Error("Invalid Content");

  return flattenedDoc;
};

export { ydocToTextContent };
