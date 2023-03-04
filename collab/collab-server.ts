import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { TiptapTransformer } from "@hocuspocus/transformer";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const server = Server.configure({
  port: 3001,
  extensions: [
    new Database({
      async fetch(data) {
        return new Promise((resolve, reject) => {
          prisma.document
            .findUnique({
              where: { documentName: "test" },
            })
            .then((doc) => {
              doc?.ydoc ? resolve(doc.ydoc) : reject("No document found");
            });
        });
      },
      async store(data) {
        const state = data.state;
        await prisma.document.upsert({
          where: {
            ownerId_documentName: {
              ownerId: "clet2lsgm0003xd6rt1cbhpxm", // sample account id
              documentName: "test",
            },
          },
          create: {
            documentName: "test",
            ydoc: state,
            ownerId: "clet2lsgm0003xd6rt1cbhpxm",
          },
          update: { ydoc: state },
        });
      },
    }),
  ],

  async onConnect(data) {
    console.log(`${data.request.socket.remoteAddress} connected`);
  },
});

server.listen();
