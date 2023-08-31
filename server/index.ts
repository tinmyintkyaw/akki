import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import dotenv from "dotenv";
import express from "express";
import expressWebsockets from "express-ws";

import { prisma } from "../lib/prismadb";
import authenticate from "./authenticate";
import checkFirstStart from "./checkFirstStart";
import fetchPage from "./fetchPage";
import storePage from "./storePage";

dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

const sessionValidateInterval = 10 * 60 * 1000;
const jitter = Math.floor(Math.random() * 5000);

let lastCheckedTimestamps = new Map<string, number>();

// Configure hocuspocus
const server = Server.configure({
  async onConnect() {
    console.log("New connection");
  },

  async onAuthenticate(data) {
    console.log("Authenticating");
    return await authenticate(data, lastCheckedTimestamps);
  },

  // Check for the validity of current session periodically
  beforeHandleMessage(data) {
    return new Promise(async (resolve, reject) => {
      const sessionTimestamp = lastCheckedTimestamps.get(
        data.context.sessionId
      );
      if (!sessionTimestamp) return reject();

      if (Date.now() - sessionTimestamp >= sessionValidateInterval + jitter) {
        try {
          await prisma.multiplayerSession.findUniqueOrThrow({
            where: {
              id: data.context.sessionId,
            },
          });
          lastCheckedTimestamps.set(data.context.sessionId, Date.now());
        } catch (error) {
          console.log("Terminating session");
          return reject();
        }
      }

      resolve(data);
    });
  },

  extensions: [
    new Database({
      async fetch(data) {
        console.log("Fetching page");
        return fetchPage(data);
      },
      async store(data) {
        console.log("Storing page");
        return storePage(data);
      },
    }),
  ],
});

// Setup express instance using the express-ws extension
const { app } = expressWebsockets(express());

// Add a websocket route for hocuspocus
app.ws("/collaboration", (websocket, request) => {
  server.handleConnection(websocket, request);
});

// Start the server
app.listen(8080, async () => {
  console.log("Listening on http://127.0.0.1:8080");
  await checkFirstStart();
});
