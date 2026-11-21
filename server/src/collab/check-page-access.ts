import { hasContentPermissions } from "#/auth/has-content-permission.js";
import { db } from "#/db/db.js";

const checkPageAccess = async (headers: Headers, pageId: string) => {
  const page = await db
    .selectFrom("page")
    .where("id", "=", pageId)
    .select(["organizationId"])
    .executeTakeFirst();

  if (!page) return { read: false, write: false };

  const [canRead, canWrite] = await Promise.all([
    hasContentPermissions(headers, page.organizationId, "read"),
    hasContentPermissions(headers, page.organizationId, "write"),
  ]);

  return {
    read: canRead,
    write: canWrite,
  };
};

export { checkPageAccess };
