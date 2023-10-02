import sessionController from "@/controllers/session-controller";
import checkIfSignedIn from "@/middlewares/check-signin";
import authRouter from "@/routes/auth-router";
import fileRouter from "@/routes/file-router";
import pageRouter from "@/routes/page-router";
import checkFirstStart from "@/utils/check-first-start.js";
import initTypesenseClient from "@/utils/init-typesense-client.js";
import hocuspocusServer from "@/websocket/websocket-server.js";
import { Prisma } from "@prisma/client";
import express, { ErrorRequestHandler } from "express";
import expressWebsockets from "express-ws";

const { app } = expressWebsockets(express());

export const typesenseClient = initTypesenseClient(
  process.env.TYPESENSE_HOST,
  parseInt(process.env.TYPESENSE_PORT),
  process.env.TYPESENSE_API_KEY,
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authRouter);

app.get("/health", (_req, res) => res.sendStatus(200));
app.get("/session", sessionController);
app.use("/pages", checkIfSignedIn, pageRouter);
app.use("/files", checkIfSignedIn, fileRouter);

app.ws("/editor", (websocket, req) => {
  hocuspocusServer.handleConnection(websocket, req);
});

app.use("/*", (_req, res) => res.sendStatus(501));

// TODO: Implement proper error handler
const errorHandler: ErrorRequestHandler = (error, _req, res) => {
  console.error(error);
  res.sendStatus(500);
};
app.use(errorHandler);

checkFirstStart()
  .then(() => {
    app.listen(3300, async () => {
      console.log("Listening on port 3300");
    });
  })
  .catch((error) => {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.log("Cannot connect to DB");
    }
    process.exit(1);
  });
