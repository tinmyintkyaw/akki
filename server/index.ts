import express from "express";
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Database } from "@hocuspocus/extension-database";

import prisma from "../lib/prismadb";
import { TiptapTransformer } from "@hocuspocus/transformer";

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
          // // Convert Ydoc into prosemirror JSON format for accessing the text
          // // content of the title node later on
          // const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);

          // // A not very clean way to access the text of the very first node
          // // in the doc, which is title node in the schema
          // const editorTitleNode = prosemirrorJSON.default.content[0];

          // const dbPageName =
          //   editorTitleNode.content.length > 0
          //     ? editorTitleNode.content[0].text
          //     : "Untitled";

          await prisma.page.update({
            where: {
              id_userId: {
                userId: data.context.userId,
                id: data.documentName,
              },
            },

            data: {
              // We want the text of the title node to be in sync with pageName stored in the DB
              // pageName: dbPageName,
              ydoc: data.state,
              modifiedAt: new Date(),
            },
          });
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
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:3000",
    // changeOrigin: true,
  })
);

// Start the server
app.listen(8080, () => console.log("Listening on http://127.0.0.1:8080"));
