import { Page } from "@/types/database.js";
import { PageListResponse, PageResponse } from "@project/shared-types";

type PageFromDBQuery = Omit<Page, "ydoc">;
type PageListFromDBQuery = Array<
  PageFromDBQuery & { children?: string[] | null }
>;

export const transformPageForClient = (page: PageFromDBQuery): PageResponse => {
  return {
    id: page.id,
    pageName: page.page_name,
    path: page.path,
    isStarred: page.is_starred,
    createdAt: page.created_at,
    accessedAt: page.accessed_at,
    modifiedAt: page.modified_at,
    deletedAt: page.deleted_at,
    userId: page.user_id,
  };
};

export const transformPageListForClient = (
  pageList: PageListFromDBQuery,
): PageListResponse => {
  return pageList.map((page) => ({
    id: page.id,
    pageName: page.page_name,
    path: page.path,
    children: page.children ? page.children : undefined,
    isStarred: page.is_starred,
    createdAt: page.created_at,
    accessedAt: page.accessed_at,
    modifiedAt: page.modified_at,
    deletedAt: page.deleted_at,
    userId: page.user_id,
  }));
};
