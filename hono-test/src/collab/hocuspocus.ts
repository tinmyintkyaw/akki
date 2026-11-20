import { auth } from "#/auth/auth.js";
import { checkPageAccess } from "#/collab/check-page-access.js";
import { db } from "#/db/db.js";
import {
  syncPageContent,
  syncPageMetadata,
} from "#/search/sync-to-meilisearch.js";
import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { sql } from "kysely";

interface HocuspocusContext {
  lastAuthCheck?: number;
  cleanCookieHeader?: string;
}

const AUTH_RECHECK_INTERVAL = 3 * 60 * 1000;

export const hocuspocus = new Hocuspocus<HocuspocusContext>({
  async onListen() {
    console.log("collaboration server started");
  },

  // periodically recheck auth status by hooking into awareness API
  // hocuspocus client sends awareness heartbeat every 15 seconds
  // so we throttle the check to not fire until at least 5 mins has passed
  async beforeHandleAwareness({ context, connection, documentName }) {
    const now = Date.now();

    if (
      !context ||
      !connection ||
      !context.lastAuthCheck ||
      !context.cleanCookieHeader
    )
      return;

    if (now - context.lastAuthCheck > AUTH_RECHECK_INTERVAL) {
      context.lastAuthCheck = now;

      const permissions = await checkPageAccess(
        new Headers({ cookie: context.cleanCookieHeader }),
        documentName,
      );

      if (!permissions.read) connection.close();
      if (!permissions.write) connection.readOnly = true;
    }
  },

  async onAuthenticate({ documentName, token, context, connectionConfig }) {
    // verify token
    const { headers } = await auth.api.verifyOneTimeToken({
      body: { token: token },
      returnHeaders: true,
    });

    const cleanCookieHeader = headers
      .getSetCookie()
      .map((header) => header.split(";")[0])
      .join("; ");

    const permissions = await checkPageAccess(
      new Headers({ cookie: cleanCookieHeader }),
      documentName,
    );

    if (!permissions.read) throw new Error("Unauthorized");
    if (!permissions.write) connectionConfig.readOnly = true;

    return {
      ...context,
      lastAuthCheck: Date.now(),
      cleanCookieHeader,
    };
  },

  extensions: [
    new Database({
      async fetch(data) {
        console.debug("fetching page", data.documentName);

        const page = await db
          .selectFrom("page")
          .where("id", "=", data.documentName)
          .select(["ydoc"])
          .executeTakeFirstOrThrow();

        return page.ydoc;
      },

      async store(data) {
        console.debug("storing page", data.documentName);

        await db
          .updateTable("page")
          .where("page.id", "=", data.documentName)
          .set({
            ydoc: data.state,
            updatedAt: sql`now()`,
          })
          .executeTakeFirstOrThrow();

        await syncPageMetadata([data.documentName], "upsert");
        await syncPageContent(data.documentName, data.document);
      },
    }),
  ],
});
