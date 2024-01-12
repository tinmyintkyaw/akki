import { useStarredPagesQuery } from "@/hooks/pageQueryHooks";
import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

const useStarredTreeData = () => {
  const starredPageListQuery = useStarredPagesQuery();

  return useMemo(() => {
    if (
      starredPageListQuery.isLoading ||
      starredPageListQuery.isError ||
      !starredPageListQuery.data
    )
      return null;

    const starredPageListMap = new Map(
      starredPageListQuery.data.map((page) => [
        page.id,
        {
          index: page.id,
          isFolder: false,
          children: [],
          data: page,
        },
      ]),
    );

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
  }, [
    starredPageListQuery.data,
    starredPageListQuery.isError,
    starredPageListQuery.isLoading,
  ]);
};

export default useStarredTreeData;
