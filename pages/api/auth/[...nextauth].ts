import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import jwt from "jsonwebtoken";

import prisma from "../../../lib/prismadb";

import socketJWTContent from "../../../types/socket-jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      // pass a JWT token to the client that can be used to authenticate
      // with the websocket server
      const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

      const jwtPayload: socketJWTContent = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };

      const socketJWT = jwt.sign(jwtPayload, NEXTAUTH_SECRET, {
        expiresIn: "30d",
      });

      session.socketJWT = socketJWT;

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
