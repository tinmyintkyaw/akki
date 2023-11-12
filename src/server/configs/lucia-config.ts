import envVars from "@/configs/env-config";
import prisma from "@/configs/prisma-client-config";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { github, google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";

export const auth = lucia({
  env: envVars.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: express(),
  adapter: prismaAdapter(prisma),
  csrfProtection: true,

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
  clientId: envVars.GOOGLE_CLIENT_ID,
  clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  redirectUri: envVars.GOOGLE_REDIRECT_URI,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
});

export const githubAuth = github(auth, {
  clientId: envVars.GITHUB_CLIENT_ID,
  clientSecret: envVars.GITHUB_CLIENT_SECRET,
});

export type Auth = typeof auth;
