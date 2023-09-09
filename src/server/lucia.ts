import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";
import { typesenseClient } from "./index.js";
import { github, google } from "@lucia-auth/oauth/providers";

const client = new PrismaClient();

const generateScopedSearchKey = (
  typesenseKey: string,
  userId: string,
  expiresAt: number
) => {
  return typesenseClient.keys().generateScopedSearchKey(typesenseKey, {
    filter_by: `userId:${userId}`,
    expires_at: expiresAt,
  });
};

export const auth = lucia({
  // env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  env: "DEV",
  middleware: express(),
  adapter: prisma(client),

  // TODO: setup CSRF protection in dev mode
  csrfProtection: false,

  getUserAttributes(databaseUser) {
    return {
      name: databaseUser.name,
      username: databaseUser.username,
      image: databaseUser.image,
      email: databaseUser.email,
      emailVerified: databaseUser.email_verified,
    };
  },
  getSessionAttributes(dbSession) {
    return {
      typesenseKeyId: dbSession.typesenseKeyId,
      typesenseKeyValue: dbSession.typesenseKeyValue,
      editorKey: dbSession.editorKey,
      searchKey: generateScopedSearchKey(
        dbSession.typesenseKeyValue,
        dbSession.user_id,
        dbSession.idle_expires
      ),
    };
  },
});

export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri: `http://localhost:3000/api/signin/google/callback`,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
});

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});

export type Auth = typeof auth;
