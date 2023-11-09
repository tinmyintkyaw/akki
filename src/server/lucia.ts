import prisma from "@/configs/prisma-client-config";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { github, google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";

export const auth = lucia({
  // env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  env: "DEV",
  middleware: express(),
  adapter: prismaAdapter(prisma),

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
