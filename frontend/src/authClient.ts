import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: "http://localhost:3400/api/auth",
  plugins: [
    inferAdditionalFields({
      session: {
        searchToken: {
          type: "string",
        },
      },
    }),
  ],
});
