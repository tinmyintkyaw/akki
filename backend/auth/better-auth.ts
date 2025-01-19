import { db } from "@/db/kysely.js";
import { defaultSearchKey } from "@/search/default-key.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: { db: db, type: "postgres" },
  // emailAndPassword: { enabled: true },

  socialProviders: {
    github: {
      enabled: parsedProcessEnv.GITHUB_OAUTH_ENABLED === "true",
      clientId: parsedProcessEnv.GITHUB_CLIENT_ID,
      clientSecret: parsedProcessEnv.GITHUB_CLIENT_SECRET,
    },
    google: {
      enabled: parsedProcessEnv.GOOGLE_OAUTH_ENABLED === "true",
      clientId: parsedProcessEnv.GOOGLE_CLIENT_ID,
      clientSecret: parsedProcessEnv.GITHUB_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      searchToken: {
        type: "string",
        fieldName: "searchToken",
        required: true,
        returned: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: { ...user, searchToken: "" },
          };
        },

        after: async (user) => {
          const tenantToken = meilisearchClient.generateTenantToken(
            defaultSearchKey.uid,
            { pages: { filter: `userId = ${user.id}` } },
            { apiKey: defaultSearchKey.key },
          );

          await db
            .updateTable("User")
            .where("User.id", "=", user.id)
            .set({ searchToken: tenantToken })
            .executeTakeFirstOrThrow();
        },
      },
    },
  },
});
