import { usePageListQuery } from "@/hooks/pageQueryHooks";
import { PageResponse } from "@project/shared-types";
import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

export const useTreeData = () => {
  const pageListQuery = usePageListQuery();

  return useMemo(() => {
    if (pageListQuery.isLoading || pageListQuery.isError || !pageListQuery.data)
      return null;

    const pageListMap = new Map(
      pageListQuery.data.map((page) => [
        page.id,
        {
          index: page.id,
          // isFolder: page.childPages.length > 0 ? true : false,
          isFolder: true,
          children: page.children ? page.children : [],
          data: page,
        },
      ]),
    );

    const childPageIds: string[] = [];

    pageListMap.forEach((page) => {
      const pathArray = page.data.path.split(".");
      if (pathArray.length <= 1) childPageIds.push(page.index);
    });

    const treeData: ExplicitDataSource<PageResponse> = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: childPageIds,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data: null,
        },
        ...Object.fromEntries(pageListMap),
      },
    };

    return treeData;
  }, [pageListQuery.data, pageListQuery.isError, pageListQuery.isLoading]);
};
