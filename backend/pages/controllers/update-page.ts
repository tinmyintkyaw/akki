import { db } from "@/db/kysely.js";
import { modifyAllDescendents } from "@/pages/utils/modify-all-descendents.js";
import { moveBranch } from "@/pages/utils/move-branch.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageForClient } from "@/pages/utils/transform-for-client.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { TypedRequestHandler } from "@/validation/request-validator.js";
import {
  PageIdAsParamsSchema,
  UpdatePagePayloadSchema,
} from "@/validation/schemas/page-schema.js";
import { MeilisearchPage } from "@project/shared-types";
import asyncHandler from "express-async-handler";

type EditPageControllerType = TypedRequestHandler<
  PageIdAsParamsSchema,
  UpdatePagePayloadSchema
>;

const requestHandler: EditPageControllerType = async (req, res) => {
  const { userId } = res.locals.session;
  const { pageId } = req.params;
  const { pageName, parentId, deletedAt, isStarred } = req.body;

  if (parentId !== undefined) {
    const result = await moveBranch(pageId, parentId);
    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      modifiedAt: page.modified_at.getTime(),
    }));
    await meilisearchClient.index("pages").updateDocuments(meilisearchPageList);
  }

  if (deletedAt !== undefined) {
    const result = await modifyAllDescendents(pageId, {
      deletedAt: deletedAt,
    });

    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      deletedAt: page.deleted_at ? page.deleted_at.getTime() : false,
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
      page_name: pageName,
      is_starred: isStarred,
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

  const response = transformPageForClient(updatedPage);

  return res.status(200).json(response);
};

export const updatePageController = asyncHandler(requestHandler);
