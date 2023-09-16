import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import getPageHandler from "./get-page-handler.js";
// import messageHandler from "./message-handler.js";
import storePageHandler from "./store-page-handler.js";
import websocketAuthHandler from "./ws-auth-handler.js";

// eslint-disable-next-line prefer-const
let lastCheckedTimestamps = new Map<string, number>();

const hocuspocusServer = Server.configure({
  async onAuthenticate(data) {
    return websocketAuthHandler(data, lastCheckedTimestamps);
  },

  // async beforeHandleMessage(data) {
  //   return messageHandler(data, lastCheckedTimestamps);
  // },

  extensions: [
    new Database({
      async fetch(data) {
        console.log("Fetching page");
        return getPageHandler(data);
      },
      async store(data) {
        console.log("Storing page");
        return storePageHandler(data);
      },
    }),
  ],
});

export default hocuspocusServer;
