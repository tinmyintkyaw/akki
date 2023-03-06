import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";

import prisma from "../../../lib/prismadb";

import socketTicket from "../../../types/socket-ticket";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user, token }) {
      session.accountId = user.id;
      return session;
    },
  },

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
