import { logger } from "@/configs/logger.js";
import { websocketAuthHandler } from "@/services/ws/auth-handler.js";
import { getPageHandler } from "@/services/ws/get-page.js";
import { storePageHandler } from "@/services/ws/store-page.js";
import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";

// eslint-disable-next-line prefer-const
let lastCheckedTimestamps = new Map<string, number>();

export const hocuspocusServer = Server.configure({
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
