import express from "express";
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";
import { createProxyMiddleware } from "http-proxy-middleware";

import { PrismaClient } from "@prisma/client";
import { Database } from "@hocuspocus/extension-database";
const prisma = new PrismaClient();

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
        console.log({
          pageName: data.requestParameters.get("pageName"),
          pageId: data.requestParameters.get("pageId"),
        });

        const page = await prisma.page.findUnique({
          where: {
            pageName_userId: {
              pageName: data.documentName,
              userId: data.context.userId,
            },
          },
        });

        if (!page) return null;

        return page.ydoc;
      },

      async store(data) {
        console.log("Storing page");

        await prisma.page.upsert({
          where: {
            pageName_userId: {
              pageName: data.documentName,
              userId: data.context.userId,
            },
          },
          create: {
            pageName: data.documentName,
            ydoc: data.state,
            userId: data.context.userId,
          },
          update: {
            ydoc: data.state,
            modifiedAt: new Date(),
          },
        });
      },
    }),
  ],
});

// Setup your express instance using the express-ws extension
const { app } = expressWebsockets(express());

// Add a websocket route for hocuspocus
// Note: make sure to include a parameter for the document name.
// You can set any contextual data like in the onConnect hook
// and pass it to the handleConnection method.
app.ws("/collaboration/:document", (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: "Jane",
    },
  };
  // console.log("New connection for document", request.params.document);

  server.handleConnection(websocket, request, request.params.document, context);
});

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:3000",
    // changeOrigin: true,
  })
);

// Start the server
app.listen(8080, () => console.log("Listening on http://127.0.0.1:8080"));
