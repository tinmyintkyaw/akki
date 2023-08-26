import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import { usePageListQuery } from "./pageQueryHooks";
import { Page } from "@/types/queries";

export const useTreeData = () => {
  const pageListQuery = usePageListQuery();

  const pageListMap = useMemo(() => {
    if (pageListQuery.isLoading || pageListQuery.isError) return null;
    return new Map(
      pageListQuery.data.map((page) => [
        page.id,
        {
          index: page.id,
          // isFolder: page.childPages.length > 0 ? true : false,
          isFolder: true,
          children: page.childPages,
          data: (() => {
            const { id, childPages, userId, ...data } = page;
            return data;
          })(),
        },
      ])
    );
  }, [pageListQuery.data, pageListQuery.isError, pageListQuery.isLoading]);

  return useMemo(() => {
    if (!pageListMap) return null;

    let childPageIds: string[] = [];

    pageListMap.forEach((page) => {
      if (page.data.parentId === null) childPageIds.push(page.index);
    });

    const treeData: ExplicitDataSource<Page> = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: childPageIds,
          // @ts-ignore
          data: null,
        },
        ...Object.fromEntries(pageListMap),
      },
    };

    return treeData;
  }, [pageListMap]);
};
