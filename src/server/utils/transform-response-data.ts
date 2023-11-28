import { pageSelect } from "@/utils/prisma-page-select";
import { Prisma } from "@prisma/client";
import { PageListResponse, PageResponse } from "@/shared/types/queryResponse";

type PageGetPayload = Prisma.PageGetPayload<{
  select: typeof pageSelect;
}>;

type PageListGetPayload = Array<
  Prisma.PageGetPayload<{
    select: typeof pageSelect;
  }>
>;

export function transformPageResponseData(page: PageGetPayload): PageResponse {
  return {
    id: page.id,
    pageName: page.page_name,
    userId: page.user_id,
    isStarred: page.is_starred,
    createdAt: page.created_at,
    modifiedAt: page.modified_at,
    accessedAt: page.accessed_at,
    isDeleted: page.is_deleted,
    deletedAt: page.deleted_at,
    parentId: page.parent_id,
    files: page.files.map((file) => ({
      id: file.id,
      fileName: file.file_name,
    })),
    childPages: page.child_pages.map((page) => page.id),
    parentPageName: page.page ? page.page_name : null,
  };
}

export function transformPageListResponseData(
  pageList: PageListGetPayload,
): PageListResponse {
  return pageList.map((page) => ({
    id: page.id,
    pageName: page.page_name,
    userId: page.user_id,
    isStarred: page.is_starred,
    createdAt: page.created_at,
    modifiedAt: page.modified_at,
    accessedAt: page.accessed_at,
    isDeleted: page.is_deleted,
    deletedAt: page.deleted_at,
    parentId: page.parent_id,
    files: page.files.map((file) => ({
      id: file.id,
      fileName: file.file_name,
    })),
    childPages: page.child_pages.map((page) => page.id),
    parentPageName: page.page ? page.page_name : null,
  }));
}
