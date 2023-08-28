import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import { useFavouritePagesQuery } from "../pageQueryHooks";

const useFavouritesTreeData = () => {
  const favPageListQuery = useFavouritePagesQuery();

  const favPageListMap = useMemo(() => {
    if (favPageListQuery.isLoading || favPageListQuery.isError) return;
    return new Map(
      favPageListQuery.data.map((page) => [
        page.id,
        {
          index: page.id,
          // isFolder: page.childPages.length > 0 ? true : false,
          isFolder: false,
          // children: page.childPages,
          children: [],
          data: (() => {
            const { id, childPages, parentId, userId, ...data } = page;
            return data;
          })(),
        },
      ])
    );
  }, [
    favPageListQuery.data,
    favPageListQuery.isError,
    favPageListQuery.isLoading,
  ]);

  return useMemo(() => {
    if (!favPageListMap) return null;

    let childPageIds: string[] = [];
    favPageListMap.forEach((page) => {
      childPageIds.push(page.index);
    });

    const favouritesTreeData: ExplicitDataSource = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: childPageIds,
          data: {},
        },
        ...Object.fromEntries(favPageListMap),
      },
    };

    return favouritesTreeData;
  }, [favPageListMap]);
};

export default useFavouritesTreeData;
