import { migrate } from "#/db/migrate.js";
import { env } from "#/env.js";
import { hocuspocus } from "#/hocuspocus.js";
import { serve, upgradeWebSocket } from "@hono/node-server"; // 👈 upgradeWebSocket comes from node-server directly
import { Hono } from "hono";
import { logger } from "hono/logger";
import { WebSocket, WebSocketServer } from "ws"; // 👈 Required by the new built-in engine
import { auth } from "./auth/auth.js";

const app = new Hono();

app.use(logger());

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.get(
  "/api/collab",
  upgradeWebSocket((c) => {
    let clientConnection: any;
    return {
      onOpen(_evt, ws) {
        const nodeWs = ws.raw as WebSocket;
        nodeWs.binaryType = "arraybuffer";
        clientConnection = hocuspocus.handleConnection(nodeWs, c.req.raw, {});
      },
      onMessage(evt) {
        clientConnection?.handleMessage(
          new Uint8Array(evt.data as ArrayBuffer),
        );
      },
      onClose() {
        clientConnection?.handleClose();
      },
    };
  }),
);

const wss = new WebSocketServer({ noServer: true });

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
    websocket: {
      server: wss,
    },
  },
  async (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);

    await migrate();

    hocuspocus.hooks("onListen", {
      instance: hocuspocus,
      configuration: hocuspocus.configuration,
      port: info.port,
    });
  },
);
