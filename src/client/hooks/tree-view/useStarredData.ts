import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import { useStarredPagesQuery } from "../pageQueryHooks";

const useStarredTreeData = () => {
  const starredPageListQuery = useStarredPagesQuery();

  const starredPageListMap = useMemo(() => {
    if (starredPageListQuery.isLoading || starredPageListQuery.isError)
      return null;

    return new Map(
      starredPageListQuery.data.map((page) => [
        page.id,
        {
          index: page.id,
          // isFolder: page.childPages.length > 0 ? true : false,
          isFolder: false,
          // children: page.childPages,
          children: [],
          data: (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, childPages, parentId, userId, ...data } = page;
            return data;
          })(),
        },
      ]),
    );
  }, [
    starredPageListQuery.data,
    starredPageListQuery.isError,
    starredPageListQuery.isLoading,
  ]);

  return useMemo(() => {
    if (!starredPageListMap) return null;

    const childPageIds: string[] = [];
    starredPageListMap.forEach((page) => {
      childPageIds.push(page.index);
    });

    const starredTreeData: ExplicitDataSource = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: childPageIds,
          data: {},
        },
        ...Object.fromEntries(starredPageListMap),
      },
    };

    return starredTreeData;
  }, [starredPageListMap]);
};

export default useStarredTreeData;
