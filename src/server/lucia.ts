import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";

const client = new PrismaClient();

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
      searchKeyId: databaseUser.searchKeyId,
      searchKey: databaseUser.searchKey,
    };
  },
  getSessionAttributes(databaseSession) {
    return {
      editorKey: databaseSession.editorKey,
    };
  },
});

export type Auth = typeof auth;
