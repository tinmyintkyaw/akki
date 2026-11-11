import { hocuspocus } from "#/collab/hocuspocus.js";
import collab from "#/collab/index.js";
import { migrate } from "#/db/migrate.js";
import { env } from "#/env.js";
import getPages from "#/get-page.js";
import { serve } from "@hono/node-server"; // 👈 upgradeWebSocket comes from node-server directly
import { Hono } from "hono";
import { logger } from "hono/logger";
import { WebSocketServer } from "ws"; // 👈 Required by the new built-in engine
import { auth } from "./auth/auth.js";

const app = new Hono();

app.use(logger());

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/pages", getPages);

app.route("/api", collab);

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
