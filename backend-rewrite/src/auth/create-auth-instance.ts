import { betterAuth } from "better-auth";
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
  });

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export { createAuthInstance };
