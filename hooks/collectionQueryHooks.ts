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
