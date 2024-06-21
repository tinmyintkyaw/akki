import { parsedProcessEnv } from "@/configs/env-variables.js";
import { redisClient } from "@/configs/ioredis.js";
import { logger } from "@/configs/logger.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
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
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

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

export { app as express };
