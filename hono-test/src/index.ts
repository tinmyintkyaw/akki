import { auth } from "#/auth/auth.js";
import { hocuspocus } from "#/collab/hocuspocus.js";
import collab from "#/collab/index.js";
import { migrate } from "#/db/migrate.js";
import { env } from "#/env.js";
import pages from "#/pages/index.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { WebSocketServer } from "ws";

const app = new Hono();

app.use(logger());

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api", pages);

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
