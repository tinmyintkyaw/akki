import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";
import { typesenseClient } from "./index.js";

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
      username: databaseUser.username,
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

export type Auth = typeof auth;
