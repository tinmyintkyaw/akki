import { auth } from "#/auth/auth.js";
import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { db } from "#/db/db.js";
import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { sql } from "kysely";

interface HocuspocusContext {
  spaceId: string;
  pageId: string;
  lastAuthCheck?: number;
  cleanCookieHeader?: string;
}

const getSpacePermissions = async (headers: Headers, spaceId: string) => {
  const [canRead, canWrite] = await Promise.all([
    await hasContentPermissions(headers, spaceId, "read"),
    await hasContentPermissions(headers, spaceId, "write"),
  ]);

  return {
    read: canRead,
    write: canWrite,
  };
};

const AUTH_RECHECK_INTERVAL = 3 * 60 * 1000;

export const hocuspocus = new Hocuspocus<HocuspocusContext>({
  async onListen() {
    console.log("collaboration server started");
  },

  // periodically recheck auth status by hooking into awareness API
  // hocuspocus client sends awareness heartbeat every 15 seconds
  // so we throttle the check to not fire until at least 5 mins has passed
  async beforeHandleAwareness({ context, connection }) {
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

      const permissions = await getSpacePermissions(
        new Headers({ cookie: context.cleanCookieHeader }),
        context.spaceId,
      );

      if (!permissions.read) connection.close();
      if (!permissions.write) connection.readOnly = true;

      try {
        await db
          .selectFrom("page")
          .where("organizationId", "=", context.spaceId)
          .where("id", "=", context.pageId)
          .select("id")
          .executeTakeFirstOrThrow();
      } catch (error) {
        connection.close();
      }
    }
  },

  async onAuthenticate(data) {
    // verify token
    const { headers, response } = await auth.api.verifyOneTimeToken({
      body: { token: data.token },
      returnHeaders: true,
    });

    const cleanCookieHeader = headers
      .getSetCookie()
      .map((header) => header.split(";")[0])
      .join("; ");

    // check space authorization
    const permissions = await getSpacePermissions(
      new Headers({ cookie: cleanCookieHeader }),
      data.context.spaceId,
    );

    if (!permissions.read) throw new Error("Unauthorized");
    if (!permissions.write) data.connectionConfig.readOnly = true;

    // check page authorization
    await db
      .selectFrom("page")
      .where("organizationId", "=", data.context.spaceId)
      .where("id", "=", data.context.pageId)
      .select("id")
      .executeTakeFirstOrThrow();

    return {
      ...data.context,
      lastAuthCheck: Date.now(),
      cleanCookieHeader,
    };
  },

  extensions: [
    new Database({
      async fetch(data) {
        const page = await db
          .selectFrom("page")
          .where("id", "=", data.documentName)
          .select(["ydoc"])
          .executeTakeFirstOrThrow();

        return page.ydoc;
      },

      async store(data) {
        await db
          .updateTable("page")
          .where("page.id", "=", data.documentName)
          .set({
            ydoc: data.state,
            updatedAt: sql`now()`,
          })
          .executeTakeFirstOrThrow();
      },
    }),
  ],
});
