import { usePageListQuery } from "@/hooks/pageQueryHooks";
import { PageResponse } from "@/shared/types/queryResponse";
import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, childPages, userId, ...data } = page;
            return data;
          })(),
        },
      ]),
    );
  }, [pageListQuery.data, pageListQuery.isError, pageListQuery.isLoading]);

  return useMemo(() => {
    if (!pageListMap) return null;

    const childPageIds: string[] = [];

    pageListMap.forEach((page) => {
      if (page.data.parentId === null) childPageIds.push(page.index);
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
  }, [pageListMap]);
};
