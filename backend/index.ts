import { authenticatedUser } from "@/auth/authenticated-user.js";
import { auth } from "@/auth/better-auth.js";
import { hocuspocusHandler } from "@/collaboration/hocuspocus.js";
import { logger } from "@/logger/index.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import { pageRouter } from "@/pages/page-router.js";
import { globalRateLimiter, sessionRateLimiter } from "@/rate-limit/index.js";
import { defaultSearchKey } from "@/search/default-key.js";
import { checkDBConnection } from "@/startup/check-db-connection.js";
import { checkMellisearchDB } from "@/startup/check-meilisearch-db.js";
import { migrateToLatest } from "@/startup/migrate-to-latest.js";
import fileRouter from "@/uploads/file-router.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import expressWebsockets from "express-ws";
import helmet from "helmet";

await checkDBConnection();
await migrateToLatest();
await checkMellisearchDB();
// await checkDemoMode();

const { app } = expressWebsockets(express());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(globalRateLimiter);

app.use((_req, res, next) => {
  res.locals.defaultSearchKey = defaultSearchKey;
  next();
});

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());

app.get("/health", (_req, res) => res.sendStatus(200));
app.use("/api/pages", authenticatedUser, sessionRateLimiter, pageRouter);
app.use("/files", authenticatedUser, sessionRateLimiter, fileRouter);

app.ws("/api/editor", hocuspocusHandler);

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

const port = parsedProcessEnv.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`));
