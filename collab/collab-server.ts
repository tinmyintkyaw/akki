// Deprecated, use the new server.ts instead
// Kept for reference
import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { TiptapTransformer } from "@hocuspocus/transformer";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { getServerSession } from "next-auth";

const server = Server.configure({
  port: 4000, // TODO: Make this configurable via env var

  // async onAuthenticate({ token }) {
  //   console.log("Authenticating");

  //   if (!token) {
  //     throw new Error("No token provided");
  //   }

  //   try {
  //     const result = await prisma.socketSession.findUniqueOrThrow({
  //       where: { socketToken: token },
  //     });

  //     console.log(result);

  //     if (result.expires < new Date()) {
  //       throw new Error("Token expired");
  //     }

  //     console.log("authenticated");

  //     await prisma.socketSession.delete({ where: { socketToken: token } });
  //     console.log("deleted");

  //     return { userId: result.userId };
  //   } catch (err) {
  //     throw new Error("Invalid token");
  //   }
  // },

  async onConnect(data) {
    console.log(`${data.request.socket.remoteAddress} connected`);
  },

  // extensions: [
  //   new Database({
  //     async fetch(data) {
  //       return new Promise(async (resolve, reject) => {
  //         console.log("Fetching document");

  //         try {
  //           const document = await prisma.document.findUniqueOrThrow({
  //             where: {
  //               documentName_userId: {
  //                 documentName: data.documentName,
  //                 userId: data.context.userId,
  //               },
  //             },
  //           });

  //           resolve(document.ydoc);
  //         } catch (err) {
  //           // we don't need initialze a new Y.js document
  //           // just reject the prosimise and
  //           // hocuspocus will do that for us in onStoreDocument hook
  //           reject("Document not found");
  //         }
  //       });
  //     },

  //     async store(data) {
  //       console.log("Storing document");

  //       try {
  //         await prisma.document.upsert({
  //           where: {
  //             documentName_userId: {
  //               documentName: data.documentName,
  //               userId: data.context.userId,
  //             },
  //           },
  //           create: {
  //             documentName: data.documentName,
  //             ydoc: data.state,
  //             userId: data.context.userId,
  //           },
  //           update: {
  //             ydoc: data.state,
  //             modifiedAt: new Date(),
  //           },
  //         });
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     },
  //   }),
  // ],
});

server.listen();
