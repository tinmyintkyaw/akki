import { db } from "#/db/db.js";
import { syncPageMetadata } from "#/search/sync-to-meilisearch.js";

export const syncPagesOfOrg = async (organizationId: string) => {
  const affectedPages = await db
    .selectFrom("page")
    .select("id")
    .where("organizationId", "=", organizationId)
    .execute();

  const affectedPageIds = affectedPages.map((page) => page.id);

  await syncPageMetadata(affectedPageIds, "upsert");
};
