import { ac, admin, guest, member, owner } from "#/auth/roles.js";
import { db } from "#/db/db.js";
import { env } from "#/env.js";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { oneTimeToken } from "better-auth/plugins/one-time-token";

export const auth = betterAuth({
  database: { db },
  advanced: { database: { generateId: false } },
  baseURL: env.BASE_URL,
  emailAndPassword: {
    enabled: env.ENABLE_EMAIL_SIGNIN,
    disableSignUp: env.DISABLE_SIGNUPS,
  },
  plugins: [
    organization({ ac, roles: { guest, member, admin, owner } }),
    oneTimeToken({ expiresIn: 1 }),
  ],
  trustedOrigins:
    env.NODE_ENV === "development" ? ["http://localhost:5173"] : undefined,
});
