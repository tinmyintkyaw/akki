import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import { CollectionList, PageList } from "@/types/queries";
import { usePagesListQuery } from "./pageQueryHooks";
import { useCollectionListQuery } from "./collectionQueryHooks";

export const useTreeData = () => {
  const pageListQuery = usePagesListQuery();
  const collectionListQuery = useCollectionListQuery();

  return useMemo(() => {
    if (pageListQuery.isLoading || pageListQuery.isError) return;
    if (collectionListQuery.isLoading || collectionListQuery.isError) return;

    const pagesMap = new Map(
      pageListQuery.data.map((page) => [
        page.id,
        { index: page.id, isFolder: false, children: [], data: page },
      ])
    );

    const collectionsMap = new Map(
      collectionListQuery.data.map((collection) => {
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

    const treeData: ExplicitDataSource = {
      items: {
        root: {
          index: "root",
          isFolder: true,
          children: [...Array.from(collectionsMap.keys())],
          data: {},
        },
        ...Object.fromEntries(collectionsMap),
        ...Object.fromEntries(pagesMap),
      },
    };

    return treeData;
  }, [
    collectionListQuery.data,
    collectionListQuery.isError,
    collectionListQuery.isLoading,
    pageListQuery.data,
    pageListQuery.isError,
    pageListQuery.isLoading,
  ]);
};

interface useFavouritesTreeDataProps {
  pages: PageList;
  favouritePages: PageList;
  favouriteCollections: CollectionList;
}

export const useFavouritesTreeData = (props: useFavouritesTreeDataProps) => {
  const { favouriteCollections, pages, favouritePages } = props;

  return useMemo(() => {
    const collectionsMap = new Map(
      favouriteCollections.map((collection) => {
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
      pages
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
            ...favouritePages.map((page) => page.id), // Pages explicitly marked as Favourite
          ],
          data: {},
        },
        ...Object.fromEntries(collectionsMap),
        ...Object.fromEntries(pagesMap),
      },
    };

    return favouritesTreeData;
  }, [favouriteCollections, favouritePages, pages]);
};
