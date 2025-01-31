import { db } from "@/db/kysely.js";
import { seedNewUserData } from "@/pages/seed-new-user-data.js";
import { defaultSearchKey } from "@/search/default-key.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
  database: { db: db, type: "postgres" },
  // emailAndPassword: { enabled: true },

  plugins: [
    anonymous({
      emailDomainName: "example.com",
    }),
  ],

  socialProviders: {
    github: {
      enabled: parsedProcessEnv.GITHUB_OAUTH_ENABLED === "true",
      clientId: parsedProcessEnv.GITHUB_CLIENT_ID,
      clientSecret: parsedProcessEnv.GITHUB_CLIENT_SECRET,
    },
    google: {
      enabled: parsedProcessEnv.GOOGLE_OAUTH_ENABLED === "true",
      clientId: parsedProcessEnv.GOOGLE_CLIENT_ID,
      clientSecret: parsedProcessEnv.GOOGLE_CLIENT_SECRET,
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
          console.log(user);
          return {
            data: { ...user, searchToken: "" },
          };
        },

        after: async (user) => {
          console.log(user);
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

          await seedNewUserData(user.id);
        },
      },
    },
  },
});
