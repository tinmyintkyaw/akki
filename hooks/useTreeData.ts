import { useMemo } from "react";
import { ExplicitDataSource } from "react-complex-tree";

import {
  CollectionList,
  DeletedCollectionList,
  PageList,
  DeletedPageList,
} from "@/types/queries";

interface useTreeDataProps {
  pages: PageList | DeletedPageList;
  collections: CollectionList | DeletedCollectionList;
}

export const useTreeData = (props: useTreeDataProps) => {
  const { collections, pages } = props;

  return useMemo(() => {
    const pagesMap = new Map(
      pages.map((page) => [
        page.id,
        { index: page.id, isFolder: false, children: [], data: page },
      ])
    );

    const collectionsMap = new Map(
      collections.map((collection) => {
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
  }, [collections, pages]);
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
