import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { Collection, CollectionList } from "@/types/queries";

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

export const useCreateCollectionMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: { collectionName?: string }) => {
      const { collectionName } = variables;

      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(typeof collectionName !== "undefined" && { collectionName }),
        }),
      });
      if (!response.ok) throw new Error("Failed to create collection");
      const json: Collection = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
    },
  });
};

export const useUpdateCollectionMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      collectionName?: string;
      isFavourite?: boolean;
      accessedAt?: string;
    }) => {
      const { id, collectionName, isFavourite, accessedAt } = variables;

      const response = await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(typeof collectionName !== "undefined" && {
            collectionName: collectionName,
          }),
          ...(typeof isFavourite !== "undefined" && { isFavourite }),
          ...(typeof accessedAt !== "undefined" && { accessedAt }),
        }),
      });
      if (!response.ok) throw new Error("Failed to update dollection");
      const json: Collection = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["favouritePages"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["favouriteCollections"] });
    },
  });
};

export const useDeleteCollectionMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const { id } = variables;

      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });
      if (!response.ok) throw new Error("Failed to delete collection");
      const json: Collection = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["favouritePages"] });
      queryClient.invalidateQueries({ queryKey: ["favouriteCollections"] });
      queryClient.invalidateQueries({ queryKey: ["deletedCollections"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
    },
  });
};
