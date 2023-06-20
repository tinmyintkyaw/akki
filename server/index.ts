import express from "express";
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";

import prisma from "../lib/prismadb";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { generateText } from "@tiptap/core";

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

    const cookieString = data.requestHeaders.cookie;

    if (!cookieString) return null;

    const cookieObject: { [key: string]: string } = {};

    const cookieArray = cookieString.split(";");
    cookieArray.forEach(async (cookie) => {
      const [key, value] = cookie.split("=");
      cookieObject[key.trim()] = value;
    });

    if (!cookieObject["next-auth.session-token"]) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken: cookieObject["next-auth.session-token"] },
    });

    if (!session) return null;
    if (session.expires < new Date()) return null;

    return { userId: session.userId };
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
          const json = await TiptapTransformer.fromYdoc(data.document);

          const textContent = generateText(json.default, [
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
  server.handleConnection(websocket, request, request.params.document);
});

// Add a proxy route for the nextjs server
// app.use(
//   "/",
//   createProxyMiddleware({
//     target: "http://localhost:3000",
//     // changeOrigin: true,
//   })
// );

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
