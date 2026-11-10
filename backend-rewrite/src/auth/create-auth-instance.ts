import { ac, admin, guest, member, owner } from "#/auth/roles.js";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { FastifyInstance } from "fastify";

const createAuthInstance = (fastify: FastifyInstance) =>
  betterAuth({
    database: { db: fastify.db },
    advanced: { database: { generateId: false } },
    baseURL: fastify.config.BASE_URL,
    emailAndPassword: {
      enabled: fastify.config.ENABLE_EMAIL_SIGNIN,
      disableSignUp: fastify.config.DISABLE_SIGNUPS,
    },
    plugins: [organization({ ac, roles: { guest, member, admin, owner } })],
  });

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export { createAuthInstance };
