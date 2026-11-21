import { auth } from "#/auth/auth.js";
import { hocuspocus } from "#/collab/hocuspocus.js";
import { migrate } from "#/db/migrate.js";
import { env } from "#/env.js";
import { initSearch } from "#/search/init-search.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { WebSocketServer } from "ws";
import { routes } from "#/routes.js";

const app = new Hono();

app.use(logger());

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api", routes);

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

    await initSearch();

    hocuspocus.hooks("onListen", {
      instance: hocuspocus,
      configuration: hocuspocus.configuration,
      port: info.port,
    });
  },
);
