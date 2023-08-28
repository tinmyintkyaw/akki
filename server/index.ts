import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import express from "express";
import expressWebsockets from "express-ws";

import authenticate from "./authenticate";
import fetchPage from "./fetchPage";
import storePage from "./storePage";
import checkFirstStart from "./checkFirstStart";

// Configure hocuspocus
const server = Server.configure({
  async onConnect(data) {
    console.log("New connection");
  },

  async onAuthenticate(data) {
    console.log("Authenticating");
    return await authenticate(data);
  },

  // TODO: Check for the validity of current session every x interval
  // beforeHandleMessage(data) {
  //   return new Promise((resolve, reject) => {
  //     console.log(data.instance.getConnectionsCount());
  //     resolve(data);
  //   });
  // },

  extensions: [
    new Database({
      async fetch(data) {
        console.log("Fetching page");
        return await fetchPage(data);
      },
      async store(data) {
        console.log("Storing page");
        return await storePage(data);
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
