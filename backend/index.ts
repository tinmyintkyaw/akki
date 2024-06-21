import { hocuspocusHandler } from "@/collaboration/hocuspocus.js";
import { redisClient } from "@/configs/ioredis.js";
import { sessionController } from "@/controllers/session.js";
import { parsedProcessEnv } from "@/env-vars/env-variables.js";
import { logger } from "@/logger/index.js";
import { checkIfSignedIn } from "@/middlewares/check-signed-in.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import {
  globalRateLimiter,
  sessionRateLimiter,
} from "@/middlewares/rate-limit.js";
import { authRouter } from "@/routes/auth-router.js";
import fileRouter from "@/routes/file-router.js";
import { pageRouter } from "@/routes/page-router.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { checkDBConnection } from "@/startup/check-db-connection.js";
import { checkDemoMode } from "@/startup/check-demo-mode.js";
import { checkMellisearchDB } from "@/startup/check-meilisearch-db.js";
import { commitMeilisearchCredentialsToRedis } from "@/startup/commit-meilisearch-key-to-redis.js";
import { migrateToLatest } from "@/startup/migrate-to-latest.js";
import express from "express";
import expressWebsockets from "express-ws";
import helmet from "helmet";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

await checkDBConnection();
await migrateToLatest();
await checkMellisearchDB();
await checkDemoMode();
await commitMeilisearchCredentialsToRedis();

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

app.use(
  "/test",
  checkIfSignedIn,
  sessionRateLimiter,
  async (req, res, next) => {
    const defaultSearchKeyId = await redisClient.get("search:keyId");
    const defaultSearchKeyValue = await redisClient.get("search:keyValue");

    if (!defaultSearchKeyId || !defaultSearchKeyValue) throw new Error();

    const searchToken = meilisearchClient.generateTenantToken(
      defaultSearchKeyId,
      {
        pages: { filter: `userId = ${res.locals.session.user.userId}` },
      },
      {
        apiKey: defaultSearchKeyValue,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    );

    req.headers["authorization"] = `Bearer ${searchToken}`;

    next();
  },
  createProxyMiddleware({
    router: () => ({
      protocol: "http:",
      host: parsedProcessEnv.MEILI_HOST ?? "127.0.0.1",
      port: parsedProcessEnv.MEILI_PORT,
    }),

    // `fixRequestBody` is required when bodyParser middleware loaded before proxy middleware
    // https://github.com/chimurai/http-proxy-middleware/tree/v2.0.6#intercept-and-manipulate-requests
    on: { proxyReq: fixRequestBody },

    logger: logger,
  }),
);

app.ws("/editor", hocuspocusHandler);

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

const port = parsedProcessEnv.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`));
