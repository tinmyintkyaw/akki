import { prisma } from "@/lib/prismadb";
import { pageSelect } from "@/pages/api/pages";

const queryPageFn = () => {
  const page = await prisma.page.findFirst({ select: pageSelect });
  if (!page) return undefined;

  const { Page, ...response } = {
    ...page,
    parentPageName: page.Page ? page.pageName : null,
    childPages: page?.childPages.map((page) => page.id),
  };

  return response;
};

const queryPageListFn = () => {
  const pageList = await prisma.page.findMany({ select: pageSelect });
  const response = pageList.map((page) => {
    const { Page, ...response } = {
      ...page,
      childPages: page.childPages.map((page) => page.id),
      parentPageName: page.Page ? page.Page.pageName : null,
    };

    return response;
  });

  return response;
};

export type Page = NonNullable<Awaited<ReturnType<typeof queryPageFn>>>;
export type PageList = Awaited<ReturnType<typeof queryPageListFn>>;
