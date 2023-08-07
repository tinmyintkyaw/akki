import { useQuery } from "@tanstack/react-query";

import { CollectionList } from "@/types/queries";

export const useCollectionListQuery = () => {
  return useQuery({
    queryKey: ["collectionList"],
    queryFn: async () => {
      const response = await fetch("/api/collections");
      if (!response.ok) throw new Error("Failed to fetch collections");
      const json: CollectionList = await response.json();
      return json;
    },
  });
};

export const useDeletedCollectionsQuery = () => {
  return useQuery({
    queryKey: ["deletedCollections"],
    queryFn: async () => {
      const response = await fetch("/api/collections/deleted");
      if (!response.ok) throw new Error("Failed to fetch deleted collections");
      const json: CollectionList = await response.json();
      return json;
    },
  });
};

export const useFavouriteCollectionsQuery = () => {
  return useQuery({
    queryKey: ["favouriteCollections"],
    queryFn: async () => {
      const response = await fetch("/api/collections/favourite");
      if (!response.ok)
        throw new Error("Failed to fetch favourited collections");
      const json: CollectionList = await response.json();
      return json;
    },
  });
};
