import { storePayload } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { JSONContent, generateText } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import { prisma } from "../lib/prismadb";
import CustomDocument from "../tiptap/CustomDocument";
import CustomHeading from "../tiptap/CustomHeading";
import CustomImageBackend from "../tiptap/CustomImageBackend";
import serverTypesenseClient, {
  typesensePageDocument,
} from "../typesense/typesense-client";

const storePage = (data: storePayload) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { default: json } = await TiptapTransformer.fromYdoc(data.document);

      const isJSONContent = (json: any): json is JSONContent => {
        return (json as JSONContent) !== undefined;
      };

      if (!isJSONContent(json)) throw new Error("Invalid JSON");
      if (!json.content) throw new Error("Invalid content");

      const textContent = generateText(json, [
        StarterKit.configure({
          document: false,
          history: false,
          heading: false,
        }),
        CustomDocument,
        CustomHeading.configure({ levels: [1, 2, 3] }),
        Link,
        TaskList,
        TaskItem.configure({ nested: true }),
        CustomImageBackend,
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
      const typesensePage: typesensePageDocument = {
        id: dbPage.id,
        userId: dbPage.userId,
        pageName: dbPage.pageName,
        pageTextContent: dbPage.textContent,
        pageCreatedAt: dbPage.createdAt.getTime(),
        pageModifiedAt: dbPage.modifiedAt.getTime(),
        isFavourite: dbPage.isFavourite,
      };

      await serverTypesenseClient
        .collections("pages")
        .documents()
        .upsert(typesensePage);

      // data.document.broadcastStateless("synced!");

      return resolve();
    } catch (err) {
      return reject();
    }
  });
};

export default storePage;
