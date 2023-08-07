import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import { useFavouritePagesQuery, usePagesListQuery } from "./pageQueryHooks";
import { useFavouriteCollectionsQuery } from "./collectionQueryHooks";

const useFavouritesTreeData = () => {
  const pageListQuery = usePagesListQuery();
  const favPageListQuery = useFavouritePagesQuery();
  const favCollectionListQuery = useFavouriteCollectionsQuery();

  return useMemo(() => {
    if (pageListQuery.isLoading || pageListQuery.isError) return;
    if (favPageListQuery.isLoading || favPageListQuery.isError) return;
    if (favCollectionListQuery.isLoading || favCollectionListQuery.isError)
      return;

    const collectionsMap = new Map(
      favCollectionListQuery.data.map((collection) => {
        const { pages, ...collectionWithoutChildren } = collection;
        return [
          collection.id,
          {
            index: collection.id,
            isFolder: true,
            children: collection.pages,
            data: collectionWithoutChildren,
          },
        ];
      })
    );

    const pagesMap = new Map(
      pageListQuery.data
        // get pages both explicitly marked as Favourite and
        // pages which are children of Favourited Collection
        .filter(
          (page) => page.isFavourite || collectionsMap.has(page.collectionId)
        )
        .map((page) => [
          page.id,
          { index: page.id, isFolder: false, children: [], data: page },
        ])
    );

    const favouritesTreeData: ExplicitDataSource = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: [
            ...Array.from(collectionsMap.keys()),
            // Pages explicitly marked as Favourite
            // ...favPageListQuery.data.map((page) => page.id),
            ...favPageListQuery.data
              .filter((favPage) => !collectionsMap.has(favPage.collectionId))
              .map((page) => page.id),
          ],
          data: {},
        },
        ...Object.fromEntries(collectionsMap),
        ...Object.fromEntries(pagesMap),
      },
    };

    return favouritesTreeData;
  }, [
    favCollectionListQuery.data,
    favCollectionListQuery.isError,
    favCollectionListQuery.isLoading,
    favPageListQuery.data,
    favPageListQuery.isError,
    favPageListQuery.isLoading,
    pageListQuery.data,
    pageListQuery.isError,
    pageListQuery.isLoading,
  ]);
};

export default useFavouritesTreeData;
