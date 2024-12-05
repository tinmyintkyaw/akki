import { db } from "@/db/kysely.js";
import { meilisearchClient } from "@/search/meilisearch.js";
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

  user: {
    additionalFields: {
      searchKeyId: {
        type: "string",
        fieldName: "searchKeyId",
        required: true,
        returned: false,
        input: false,
      },
      searchKeyValue: {
        type: "string",
        fieldName: "searchKeyValue",
        required: true,
        returned: false,
        input: false,
      },
    },
  },

  session: {
    additionalFields: {
      searchToken: {
        type: "string",
        fieldName: "searchToken",
        required: true,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userKey = await meilisearchClient.createKey({
            name: user.id,
            actions: ["search"],
            indexes: ["pages"],
            expiresAt: null,
          });

          return {
            data: {
              ...user,
              searchKeyId: userKey.uid,
              searchKeyValue: userKey.key,
            },
          };
        },
      },
    },

    session: {
      create: {
        before: async (session) => {
          const dbUser = await db
            .selectFrom("User")
            .selectAll()
            .where("User.id", "=", session.userId)
            .executeTakeFirstOrThrow();

          console.log(dbUser);

          const tenantToken = meilisearchClient.generateTenantToken(
            dbUser.searchKeyId,
            {
              pages: { filter: `userId = ${session.userId}` },
            },
            {
              apiKey: dbUser.searchKeyValue,
              expiresAt: session.expiresAt,
            },
          );
          return {
            data: { ...session, searchToken: tenantToken },
          };
        },
      },

      update: {
        before: async (session) => {
          const dbUser = await db
            .selectFrom("User")
            .selectAll()
            .where("User.id", "=", session.userId)
            .executeTakeFirstOrThrow();

          const tenantToken = meilisearchClient.generateTenantToken(
            dbUser.searchKeyId,
            {
              pages: { filter: `userId = ${session.userId}` },
            },
            {
              apiKey: dbUser.searchKeyValue,
              expiresAt: session.expiresAt,
            },
          );

          return {
            data: { ...session, searchToken: tenantToken },
          };
        },
      },
    },
  },
});
