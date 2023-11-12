import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import getPageHandler from "./get-page-handler";
// import messageHandler from "./message-handler";
import storePageHandler from "./store-page-handler";
import websocketAuthHandler from "./ws-auth-handler";
import logger from "@/configs/logger-config";

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
        logger.debug(`Fetching page ${data.documentName}`);
        return getPageHandler(data);
      },
      async store(data) {
        logger.debug(`Storing page ${data.documentName}`);
        return storePageHandler(data);
      },
    }),
  ],
});

export default hocuspocusServer;
