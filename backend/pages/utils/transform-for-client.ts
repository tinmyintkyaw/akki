import { Page } from "@/types/database.js";
import { PageListResponse, PageResponse } from "@project/shared-types";

type PageFromDBQuery = Omit<Page, "ydoc">;
type PageListFromDBQuery = Array<
  PageFromDBQuery & { children?: string[] | null }
>;

export const transformPageForClient = (page: PageFromDBQuery): PageResponse => {
  return {
    id: page.id,
    pageName: page.pageName,
    path: page.path,
    isStarred: page.isStarred,
    createdAt: page.createdAt,
    accessedAt: page.accessedAt,
    modifiedAt: page.modifiedAt,
    deletedAt: page.deletedAt,
    userId: page.userId,
  };
};

export const transformPageListForClient = (
  pageList: PageListFromDBQuery,
): PageListResponse => {
  return pageList.map((page) => ({
    ...page,
    children: page.children ? page.children : undefined,
    // id: page.id,
    // pageName: page.pageName,
    // path: page.path,
    // isStarred: page.isStarred,
    // createdAt: page.createdAt,
    // accessedAt: page.accessedAt,
    // modifiedAt: page.modifiedAt,
    // deletedAt: page.deletedAt,
    // userId: page.userId,
  }));
};
