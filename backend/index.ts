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
// app.use("/files", authenticatedUser, sessionRateLimiter, fileRouter);

// app.use(
//   "/test",
//   checkIfSignedIn,
//   sessionRateLimiter,
//   async (req, res, next) => {
//     const defaultSearchKeyId = await redisClient.get("search:keyId");
//     const defaultSearchKeyValue = await redisClient.get("search:keyValue");

//     if (!defaultSearchKeyId || !defaultSearchKeyValue) throw new Error();

//     const searchToken = meilisearchClient.generateTenantToken(
//       defaultSearchKeyId,
//       {
//         pages: { filter: `userId = ${res.locals.session.userId}` },
//       },
//       {
//         apiKey: defaultSearchKeyValue,
//         expiresAt: new Date(Date.now() + 60 * 60 * 1000),
//       },
//     );

//     req.headers["authorization"] = `Bearer ${searchToken}`;

//     next();
//   },
//   createProxyMiddleware({
//     router: () => ({
//       protocol: "http:",
//       host: parsedProcessEnv.MEILI_HOST ?? "127.0.0.1",
//       port: parsedProcessEnv.MEILI_PORT,
//     }),

//     // `fixRequestBody` is required when bodyParser middleware loaded before proxy middleware
//     // https://github.com/chimurai/http-proxy-middleware/tree/v2.0.6#intercept-and-manipulate-requests
//     on: { proxyReq: fixRequestBody },

//     logger: logger,
//   }),
// );

app.ws("/api/editor", hocuspocusHandler);

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

const port = parsedProcessEnv.PORT;
app.listen(port, () => logger.info(`Listening on port ${port}`));
