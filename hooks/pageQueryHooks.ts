import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { Page, PageList } from "@/types/queries";

class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const usePagesListQuery = () => {
  return useQuery({
    queryKey: ["pageList"],
    queryFn: async () => {
      const response = await fetch("/api/pages");
      if (!response.ok)
        throw new Error("Failed to fetch pages", {
          cause: { code: response.status },
        });
      const json: PageList = await response.json();
      return json;
    },
  });
};

export const useRecentPagesQuery = () => {
  return useQuery({
    queryKey: ["recentPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/recent");
      if (!response.ok) throw new Error("Failed to fetch recent pages");
      const json: PageList = await response.json();
      return json;
    },
  });
};

export const useDeletedPagesQuery = () => {
  return useQuery({
    queryKey: ["deletedPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/deleted");
      if (!response.ok) throw new Error("Failed to fetch deleted pages");
      const json: PageList = await response.json();
      return json;
    },
  });
};

export const useFavouritePagesQuery = () => {
  return useQuery({
    queryKey: ["favouritePages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/favourite");
      if (!response.ok) throw new Error("Failed to fetch favourited pages");
      const json: PageList = await response.json();
      return json;
    },
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: async (): Promise<Page> => {
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok)
        throw new FetchError("Failed to fetch page", response.status);
      const json: Page = await response.json();
      return json;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry(failureCount, error: FetchError) {
      if (error.status === 404) {
        return false;
      }
      if (failureCount <= 3) return true;
      return false;
    },
  });
};

export const useCreatePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: {
      pageName: string;
      collectionId: string;
    }) => {
      const { pageName, collectionId } = variables;

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageName, collectionId }),
      });
      if (!response.ok) throw new Error("Failed to create page");
      const json: Page = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
    },
  });
};

export const useUpdatePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      pageName?: string;
      collectionId?: string | null;
      isFavourite?: boolean;
      accessedAt?: string;
    }) => {
      const { id, pageName, collectionId, isFavourite, accessedAt } = variables;

      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(typeof pageName !== "undefined" && { pageName }),
          ...(typeof collectionId !== "undefined" && { collectionId }),
          ...(typeof isFavourite !== "undefined" && { isFavourite }),
          ...(typeof accessedAt !== "undefined" && { accessedAt }),
        }),
      });
      if (!response.ok) throw new Error("Failed to update page");
      const json: Page = await response.json();
      return json;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["favouritePages"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const useDeletePageMutation = (queryClient: QueryClient) => {
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
      if (!response.ok) throw new Error("Failed to delete page");
      const json: Page = await response.json();
      return json;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["favouritePages"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const usePermanentlyDeletePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const { id } = variables;

      const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete page");
      return response;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.removeQueries({ queryKey: ["page", id] });
    },
  });
};

export const useUndoDeletePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const { id } = variables;

      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: false }),
      });
      if (!response.ok) throw new Error("Failed to revert delete page");
      const json: Page = await response.json();
      return json;
    },
    onMutate: ({ id }) => {
      queryClient.fetchQuery({ queryKey: ["page", id] });
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["favouritePages"] });
      queryClient.invalidateQueries({ queryKey: ["collectionList"] });
      queryClient.invalidateQueries({ queryKey: ["favouriteCollections"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};
