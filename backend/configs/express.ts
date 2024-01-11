import { hocuspocusHandler } from "@/controllers/hocuspocus.js";
import { sessionController } from "@/controllers/session.js";
import { checkIfSignedIn } from "@/middlewares/check-signed-in.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import {
  globalRateLimiter,
  sessionRateLimiter,
} from "@/middlewares/rate-limit.js";
import { authRouter } from "@/routes/auth-router.js";
import fileRouter from "@/routes/file-router.js";
import { pageRouter } from "@/routes/page-router.js";
import express from "express";
import expressWebsockets from "express-ws";
import helmet from "helmet";

const { app } = expressWebsockets(express());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(globalRateLimiter);

app.use(authRouter);
app.get("/health", (_req, res) => res.sendStatus(200));
app.get("/session", sessionController);
app.use("/pages", checkIfSignedIn, sessionRateLimiter, pageRouter);
app.use("/files", checkIfSignedIn, sessionRateLimiter, fileRouter);

app.ws("/editor", hocuspocusHandler);

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

export { app as express };
