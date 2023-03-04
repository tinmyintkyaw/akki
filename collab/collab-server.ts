import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { TiptapTransformer } from "@hocuspocus/transformer";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import socketJWTContent from "@/types/socket-jwt";

function isSocketJWTContent(arg: any): arg is socketJWTContent {
  return arg.id !== undefined;
}

const server = Server.configure({
  port: 3001, // TODO: Make this configurable via env var

  async onAuthenticate({ token }) {
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

    if (!NEXTAUTH_SECRET) {
      throw new Error("NEXTAUTH_SECRET is not defined");
    }

    try {
      const decoded = jwt.verify(token, NEXTAUTH_SECRET);

      if (!isSocketJWTContent(decoded)) {
        throw new Error("Invalid token");
      }

      // TODO: Add proper logger
      console.log(`${decoded.name} authenticated`);

      // hocuspocus will pass the object returned here as the context
      // the context is available in the hooks that follow
      // like onLoadDocument, onStoreDocument, etc.
      return { id: decoded.id };
    } catch (err) {
      // auth will fail if an error is thrown
      throw new Error("Invalid token");
    }
  },

  async onConnect(data) {
    console.log(`${data.request.socket.remoteAddress} connected`);
  },

  extensions: [
    new Database({
      async fetch(data) {
        return new Promise(async (resolve, reject) => {
          console.log("Fetching document");

          try {
            const document = await prisma.document.findUniqueOrThrow({
              where: {
                documentName_userId: {
                  documentName: data.documentName,
                  userId: data.context.id,
                },
              },
            });

            resolve(document.ydoc);
          } catch (err) {
            // we don't need initialze a new Y.js document
            // just reject the prosimise and
            // hocuspocus will do that for us in onStoreDocument hook
            reject("Document not found");
          }
        });
      },

      async store(data) {
        console.log("Storing document");

        try {
          await prisma.document.upsert({
            where: {
              documentName_userId: {
                documentName: data.documentName,
                userId: data.context.id,
              },
            },
            create: {
              documentName: data.documentName,
              ydoc: data.state,
              userId: data.context.id,
            },
            update: {
              ydoc: data.state,
              modifiedAt: new Date(),
            },
          });
        } catch (err) {
          console.error(err);
        }
      },
    }),
  ],
});

server.listen();
