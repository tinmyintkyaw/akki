import { pageSelect } from "@/utils/prisma-page-select.js";
import { Prisma } from "@prisma/client";

type PageGetPayload = Prisma.PageGetPayload<{
  select: typeof pageSelect;
}>;

type PageListGetPayload = Array<
  Prisma.PageGetPayload<{
    select: typeof pageSelect;
  }>
>;

export function transformPageResponseData(page: PageGetPayload) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Page, ...response } = {
    ...page,
    childPages: page.childPages.map((page) => page.id),
    parentPageName: page.Page ? page.pageName : null,
  };

  response.files;

  return response;
}

export function transformPageListResponseData(pageList: PageListGetPayload) {
  return pageList.map((page) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Page, ...response } = {
      ...page,
      childPages: page.childPages.map((page) => page.id),
      parentPageName: page.Page ? page.Page.pageName : null,
    };
    return response;
  });
}
