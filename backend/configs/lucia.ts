import { parsedProcessEnv } from "@/configs/env-variables.js";
import { redisClient } from "@/configs/ioredis.js";
import { pool } from "@/configs/kysely.js";
import { pg } from "@lucia-auth/adapter-postgresql";
import { ioredis } from "@lucia-auth/adapter-session-redis";
import { github, google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { express } from "lucia/middleware";

const {
  NODE_ENV,
  GITHUB_OAUTH_ENABLED,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_OAUTH_ENABLED,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = parsedProcessEnv;

export const auth = lucia({
  env: NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: express(),
  csrfProtection: NODE_ENV === "development" ? false : true,

  adapter: {
    user: pg(pool, {
      user: "user",
      key: "key",
      session: null,
    }),
    session: ioredis(redisClient),
  },

  getUserAttributes(databaseUser) {
    return {
      name: databaseUser.name,
      username: databaseUser.username,
      image: databaseUser.image,
      email: databaseUser.email,
      emailVerified: databaseUser.email_verified,
    };
  },
  getSessionAttributes(databaseSession) {
    return {
      scopedSearchKey: databaseSession.scoped_search_key,
    };
  },
});

export const githubAuth =
  GITHUB_OAUTH_ENABLED === "true"
    ? github(auth, {
        clientId: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
      })
    : null;

export const googleAuth =
  GOOGLE_OAUTH_ENABLED === "true"
    ? google(auth, {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: GOOGLE_REDIRECT_URI,
        scope: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "openid",
        ],
      })
    : null;

export type Auth = typeof auth;
