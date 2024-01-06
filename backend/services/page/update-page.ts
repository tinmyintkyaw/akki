import { db } from "@/configs/kysely.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { updatePagePayloadSchema } from "@/schemas/page-schema.js";
import { modifyAllDescendents } from "@/services/page/modify-all-descendents.js";
import { moveBranch } from "@/services/page/move-branch.js";
import { selectArray } from "@/services/page/page-select.js";
import { MeilisearchPage } from "@project/shared-types";
import { z } from "zod";

export const updatePage = async (
  pageId: string,
  userId: string,
  payload: z.infer<typeof updatePagePayloadSchema>,
) => {
  if (payload.parentId !== undefined) {
    const result = await moveBranch(pageId, payload.parentId);
    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      modifiedAt: page.modified_at.getTime(),
    }));
    await meilisearchClient.index("pages").updateDocuments(meilisearchPageList);
  }

  if (payload.deletedAt !== undefined) {
    const result = await modifyAllDescendents(pageId, {
      deletedAt: payload.deletedAt,
    });

    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      deletedAt: page.deleted_at ? page.deleted_at.getTime() : null,
      modifiedAt: page.modified_at.getTime(),
    }));
    await meilisearchClient.index("pages").updateDocuments(meilisearchPageList);
  }

  // Only for updating page_name & is_starred
  const updatedPage = await db
    .updateTable("page")
    .where("user_id", "=", userId)
    .where("id", "=", pageId)
    .set({
      page_name: payload.pageName,
      is_starred: payload.isStarred,
      accessed_at: new Date(Date.now()),
      modified_at: new Date(Date.now()),
    })
    .returning(selectArray)
    .executeTakeFirstOrThrow();

  // update meilisearch
  const meilisearchPage: MeilisearchPage = {
    id: updatedPage.id,
    pageName: updatedPage.page_name,
    isStarred: updatedPage.is_starred,
    modifiedAt: updatedPage.modified_at.getTime(),
  };
  await meilisearchClient.index("pages").updateDocuments([meilisearchPage]);

  return updatedPage;
};
