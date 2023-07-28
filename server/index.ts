import express from "express";
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";

import { prisma } from "../lib/prismadb";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { JSONContent, generateText } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CustomImage from "../tiptap/CustomImageBackend";

import serverTypesenseClient, {
  typesenseCollectionSchema,
  typesensePageDocument,
} from "../typesense/typesense-client";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CustomDocument from "../tiptap/CustomDocument";
import BackendTitle from "../tiptap/BackendTitle";
import CustomHeading from "../tiptap/CustomHeading";

// Configure hocuspocus
const server = Server.configure({
  async onConnect(data) {
    console.log("New connection");
  },

  async onAuthenticate(data) {
    console.log("Authenticating");

    const socketSession = await prisma.socketSession.findUniqueOrThrow({
      where: {
        sessionToken: data.token,
      },
    });

    if (socketSession.isUsed) throw new Error("Invalid token");

    if (Date.now() - socketSession.createdAt.getTime() > 10 * 1000)
      throw new Error("Token expired");

    /* TODO: use a task scheduler for periodically purging
    used websocket tokens from db */

    await prisma.page.findUniqueOrThrow({
      where: {
        id_userId: {
          id: data.documentName,
          userId: socketSession.userId,
        },
      },
    });

    return { userId: socketSession.userId };
  },

  extensions: [
    new Database({
      async fetch(data) {
        console.log("Fetching page");

        try {
          const page = await prisma.page.findUnique({
            where: {
              id_userId: {
                userId: data.context.userId,
                id: data.documentName,
              },
            },
          });
          if (!page) return null;

          return page.ydoc;
        } catch (err) {
          console.log(err);
        }
        return null;
      },

      async store(data) {
        console.log("Storing page");

        try {
          const { default: json } = await TiptapTransformer.fromYdoc(
            data.document
          );

          const isJSONContent = (json: any): json is JSONContent => {
            return (json as JSONContent) !== undefined;
          };

          if (!isJSONContent(json)) throw new Error("Invalid JSON");

          if (!json.content) throw new Error("Invalid content");

          // Remove title node from JSON
          const [, ...contentWithoutTitle] = json.content;
          const jsonWithoutTitle = Object.assign({}, json, {
            content: contentWithoutTitle,
          });

          const textContent = generateText(jsonWithoutTitle, [
            StarterKit.configure({
              document: false,
              history: false,
              heading: false,
            }),
            CustomDocument,
            BackendTitle,
            CustomHeading.configure({ levels: [1, 2, 3] }),
            Link,
            TaskList,
            TaskItem.configure({ nested: true }),
            CustomImage.configure({ allowBase64: true }),
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
        } catch (err) {
          console.log(err);
        }
      },
    }),
  ],
});

// Setup express instance using the express-ws extension
const { app } = expressWebsockets(express());

// Add a websocket route for hocuspocus
app.ws("/collaboration/:document", (websocket, request) => {
  server.handleConnection(websocket, request);
});

// Add a proxy route for the nextjs server
// app.use(
//   "/",
//   createProxyMiddleware({
//     target: "http://localhost:3000",
//     // changeOrigin: true,
//   })
// );

// TODO: Tidy up server init
const checkFirstStart = async () => {
  const isFirstStart = await prisma.globalSetting.findUnique({
    where: { key: "isFirstStart" },
  });

  if (!isFirstStart || isFirstStart.value === "true") {
    try {
      console.log("Creating new typesense collection...");

      const isTypesenseDBExists = await serverTypesenseClient
        .collections("pages")
        .exists();

      if (isTypesenseDBExists)
        await serverTypesenseClient.collections("pages").delete();

      await serverTypesenseClient
        .collections()
        .create(typesenseCollectionSchema);
      console.log("Created collection");

      // TODO: add update logic for existing collection on version upgrade
      await prisma.globalSetting.upsert({
        where: { key: "isFirstStart" },
        update: { value: "false" },
        create: { key: "isFirstStart", value: "false" },
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("Using existing typesense collection");
  }
};

// Start the server
app.listen(8080, () => console.log("Listening on http://127.0.0.1:8080"));
checkFirstStart();
