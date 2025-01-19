import { db } from "@/db/kysely.js";
import { modifyAllDescendents } from "@/pages/utils/modify-all-descendents.js";
import { moveBranch } from "@/pages/utils/move-branch.js";
import { selectArray } from "@/pages/utils/page-select.js";
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
  const { user } = res.locals.session;
  const { pageId } = req.params;
  const { pageName, parentId, deletedAt, isStarred } = req.body;

  if (parentId !== undefined) {
    const result = await moveBranch(pageId, parentId);
    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      modifiedAt: page.modifiedAt.getTime(),
    }));
    await meilisearchClient.index("pages").updateDocuments(meilisearchPageList);
  }

  if (deletedAt !== undefined) {
    const result = await modifyAllDescendents(pageId, {
      deletedAt: deletedAt,
    });

    const meilisearchPageList: MeilisearchPage[] = result.map((page) => ({
      id: page.id,
      deletedAt: page.deletedAt ? page.deletedAt.getTime() : false,
      modifiedAt: page.modifiedAt.getTime(),
    }));
    await meilisearchClient.index("pages").updateDocuments(meilisearchPageList);
  }

  // Only for updating page_name & is_starred
  const updatedPage = await db
    .updateTable("Page")
    .where("userId", "=", user.id)
    .where("id", "=", pageId)
    .set({
      pageName: pageName,
      isStarred: isStarred,
      accessedAt: new Date(Date.now()),
      modifiedAt: new Date(Date.now()),
    })
    .returning(selectArray)
    .executeTakeFirstOrThrow();

  // update meilisearch
  const meilisearchPage: MeilisearchPage = {
    id: updatedPage.id,
    pageName: updatedPage.pageName,
    isStarred: updatedPage.isStarred,
    modifiedAt: updatedPage.modifiedAt.getTime(),
  };
  await meilisearchClient.index("pages").updateDocuments([meilisearchPage]);

  return res.status(200).json(updatedPage);
};

export const updatePageController = asyncHandler(requestHandler);
