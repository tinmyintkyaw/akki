import { authRouter } from "@/auth/auth-router.js";
import { checkIfSignedIn } from "@/auth/check-signed-in.js";
import { sessionController } from "@/auth/session.js";
import { hocuspocusHandler } from "@/collaboration/hocuspocus.js";
import { redisClient } from "@/configs/ioredis.js";
import { logger } from "@/logger/index.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import { pageRouter } from "@/pages/page-router.js";
import { globalRateLimiter, sessionRateLimiter } from "@/rate-limit/index.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { checkDBConnection } from "@/startup/check-db-connection.js";
import { checkDemoMode } from "@/startup/check-demo-mode.js";
import { checkMellisearchDB } from "@/startup/check-meilisearch-db.js";
import { commitMeilisearchCredentialsToRedis } from "@/startup/commit-meilisearch-key-to-redis.js";
import { migrateToLatest } from "@/startup/migrate-to-latest.js";
import fileRouter from "@/uploads/file-router.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
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
        pages: { filter: `userId = ${res.locals.session.userId}` },
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
