import logger from "@/configs/logger-config";
import sessionController from "@/controllers/session-controller";
import checkIfSignedIn from "@/middlewares/check-signin";
import errorHandler from "@/middlewares/error-handler";
import {
  globalRateLimiter,
  sessionRateLimiter,
} from "@/middlewares/rate-limiters";
import searchProxy from "@/middlewares/search-proxy";
import authRouter from "@/routes/auth-router";
import fileRouter from "@/routes/file-router";
import keyRouter from "@/routes/key-router";
import pageRouter from "@/routes/page-router";
import runStartupTasks from "@/utils/run-startup-tasks";
import hocuspocusServer from "@/websocket/websocket-server";
import express from "express";
import expressWebsockets from "express-ws";
import helmet from "helmet";
import requestIp from "request-ip";

const { app } = expressWebsockets(express());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(globalRateLimiter);

app.get("/health", (_req, res) => res.sendStatus(200));
app.get("/session", sessionController);
app.use(authRouter);
app.use("/pages", checkIfSignedIn, sessionRateLimiter, pageRouter);
app.use("/files", checkIfSignedIn, sessionRateLimiter, fileRouter);
app.use("/keys", checkIfSignedIn, sessionRateLimiter, keyRouter);

app.use(
  "/search/multi-search",
  checkIfSignedIn,
  sessionRateLimiter,
  searchProxy,
);

app.ws("/editor", (websocket, req) => {
  const clientIp = requestIp.getClientIp(req);
  hocuspocusServer.handleConnection(websocket, req, { clientIp });
});

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

runStartupTasks()
  .then(() => {
    app.listen(3300, async () => {
      logger.info("Listening on port 3300");
    });
  })
  .catch(() => {
    process.exit(1);
  });
