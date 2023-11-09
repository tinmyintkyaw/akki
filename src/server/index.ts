import sessionController from "@/controllers/session-controller";
import checkIfSignedIn from "@/middlewares/check-signin";
import errorHandler from "@/middlewares/error-handler";
import {
  globalRateLimiter,
  sessionRateLimiter,
} from "@/middlewares/rate-limiters";
import authRouter from "@/routes/auth-router";
import fileRouter from "@/routes/file-router";
import keyRouter from "@/routes/key-router";
import pageRouter from "@/routes/page-router";
import checkFirstStart from "@/utils/check-first-start.js";
import hocuspocusServer from "@/websocket/websocket-server.js";
import { Prisma } from "@prisma/client";
import express from "express";
import asyncHandler from "express-async-handler";
import expressWebsockets from "express-ws";
import helmet from "helmet";
import requestIp from "request-ip";

const { app } = expressWebsockets(express());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", globalRateLimiter, (_req, res) => res.sendStatus(200));
app.get("/session", globalRateLimiter, asyncHandler(sessionController));
app.use(globalRateLimiter, authRouter);
app.use("/pages", checkIfSignedIn, sessionRateLimiter, pageRouter);
app.use("/files", checkIfSignedIn, sessionRateLimiter, fileRouter);
app.use("/keys", checkIfSignedIn, sessionRateLimiter, keyRouter);

app.ws("/editor", (websocket, req) => {
  const clientIp = requestIp.getClientIp(req);
  hocuspocusServer.handleConnection(websocket, req, { clientIp });
});

app.use("/*", (_req, res) => res.sendStatus(501));

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
