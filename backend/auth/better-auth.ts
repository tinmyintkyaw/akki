import { db } from "@/db/kysely.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: { db: db, type: "postgres" },
  // emailAndPassword: { enabled: true },

  socialProviders: {
    github: {
      enabled: true,
      clientId: parsedProcessEnv.GITHUB_CLIENT_ID,
      clientSecret: parsedProcessEnv.GITHUB_CLIENT_SECRET,
    },
  },
});
