import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import getPageHandler from "./get-page-handler";
// import messageHandler from "./message-handler";
import logger from "@/configs/logger-config";
import storePageHandler from "./store-page-handler";
import websocketAuthHandler from "./ws-auth-handler";

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
        return new Promise<Buffer>((resolve, reject) => {
          getPageHandler(data)
            .then((ydoc) => {
              logger.debug(`Fetch page ${data.documentName}`);
              resolve(ydoc);
            })
            .catch(() => {
              logger.debug(`Failed to fetch page ${data.documentName}`);
              reject();
            });
        });
      },
      async store(data) {
        return new Promise<void>((resolve, reject) => {
          storePageHandler(data)
            .then(() => {
              // TODO: notify the client of successful sync
              // data.document.broadcastStateless("synced!");
              logger.debug(`Store page ${data.documentName}`);
              resolve();
            })
            .catch(() => {
              logger.debug(`Failed to store page ${data.documentName}`);
              reject();
            });
        });
      },
    }),
  ],
});

export default hocuspocusServer;
