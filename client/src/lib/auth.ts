import type { auth } from "@repo/server/auth";
import {
  inferAdditionalFields,
  inferOrgAdditionalFields,
  oneTimeTokenClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    oneTimeTokenClient(),
  ],
});

export { authClient };
