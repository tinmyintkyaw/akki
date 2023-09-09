import apiRouter from "@/routes/api-router.js";
import checkFirstStart from "@/utils/check-first-start.js";
import initTypesenseClient from "@/utils/init-typesense-client.js";
import hocuspocusServer from "@/websocket/websocket-server.js";
import { Prisma } from "@prisma/client";
import express from "express";
import expressWebsockets from "express-ws";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  target: "http://localhost:5173",
});

const { app } = expressWebsockets(express());

export const typesenseClient = initTypesenseClient(
  process.env.TYPESENSE_HOST,
  parseInt(process.env.TYPESENSE_PORT),
  process.env.TYPESENSE_API_KEY
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", apiRouter);

app.ws("/editor", (websocket, req) => {
  console.log(req.hostname);
  hocuspocusServer.handleConnection(websocket, req);
});

// TODO: turn off proxy server on PROD
app.use("/", (req, res) => {
  proxy.web(req, res, {});
});

checkFirstStart()
  .then(() => {
    app.listen(3000, async () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((error) => {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.log("Cannot connect to DB");
    }
    process.exit(1);
  });
