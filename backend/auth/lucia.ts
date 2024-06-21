import { pool } from "@/db/kysely.js";
import { UserTable } from "@/types/database.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { GitHub } from "arctic";
import { Lucia } from "lucia";
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto as Crypto;

const postgresAdapter = new NodePostgresAdapter(pool, {
  user: "user",
  session: "session",
});

export const lucia = new Lucia(postgresAdapter, {
  sessionCookie: {
    attributes: {
      secure: parsedProcessEnv.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes) {
    return {
      username: attributes.username,
    };
  },
});

export const githubOAuth = new GitHub(
  parsedProcessEnv.GITHUB_CLIENT_ID,
  parsedProcessEnv.GITHUB_CLIENT_SECRET,
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<UserTable, "id">;
  }
}
