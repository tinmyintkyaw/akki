import { hocuspocus } from "#/collab/hocuspocus.js";
import { upgradeWebSocket } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocket } from "ws";

export const collab = new Hono().get(
  "/collab",
  upgradeWebSocket((c) => {
    // type ValidatedContext = Parameters<typeof validator>[0];
    // const validParams = (c as ValidatedContext).req.valid("param");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientConnection: any;
    return {
      onOpen(_evt, ws) {
        const nodeWs = ws.raw as WebSocket;
        nodeWs.binaryType = "arraybuffer";

        clientConnection = hocuspocus.handleConnection(nodeWs, c.req.raw);
      },
      onMessage(evt) {
        clientConnection?.handleMessage(new Uint8Array(evt.data as ArrayBuffer));
      },
      onClose() {
        clientConnection?.handleClose();
      },
    };
  }),
);
