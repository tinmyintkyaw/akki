import sessionController from "@/controllers/session-controller";
import checkIfSignedIn from "@/middlewares/check-signin";
import authRouter from "@/routes/auth-router";
import fileRouter from "@/routes/file-router";
import keyRouter from "@/routes/key-router";
import pageRouter from "@/routes/page-router";
import checkFirstStart from "@/utils/check-first-start.js";
import initTypesenseClient from "@/utils/init-typesense-client.js";
import hocuspocusServer from "@/websocket/websocket-server.js";
import { Prisma } from "@prisma/client";
import express, { ErrorRequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import expressWebsockets from "express-ws";
import { LuciaError } from "lucia";
import requestIp from "request-ip";

const { app } = expressWebsockets(express());

const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const sessionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  keyGenerator: async (_req, res) => res.locals.session.sessionId,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export const typesenseClient = initTypesenseClient(
  process.env.TYPESENSE_HOST,
  parseInt(process.env.TYPESENSE_PORT),
  process.env.TYPESENSE_API_KEY,
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(globalRateLimiter, authRouter);

app.get("/health", globalRateLimiter, (_req, res) => res.sendStatus(200));
app.get("/session", globalRateLimiter, sessionController);
app.use("/pages", checkIfSignedIn, sessionRateLimiter, pageRouter);
app.use("/files", checkIfSignedIn, sessionRateLimiter, fileRouter);
app.use("/keys", checkIfSignedIn, sessionRateLimiter, keyRouter);

app.ws("/editor", (websocket, req) => {
  const clientIp = requestIp.getClientIp(req);
  hocuspocusServer.handleConnection(websocket, req, { clientIp });
});

app.use("/*", (_req, res) => res.sendStatus(501));

// TODO: Implement proper error handler
const errorHandler: ErrorRequestHandler = (error, _req, res) => {
  if (
    error instanceof LuciaError &&
    (error.message === "AUTH_INVALID_KEY_ID" ||
      error.message === "AUTH_INVALID_PASSWORD")
  ) {
    return res.sendStatus(401);
  }
  return res.sendStatus(500);
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
