import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { DeletedPage, DeletedPageList, Page, PageList } from "@/types/queries";

export const usePagesListQuery = () => {
  return useQuery({
    queryKey: ["pageList"],
    queryFn: async () => {
      const response = await fetch("/api/pages");
      if (!response.ok) throw new Error("Failed to fetch pages");
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
      const json: DeletedPageList = await response.json();
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
  });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok) throw new Error("Failed to fetch page");
      const json: Page = await response.json();
      return json;
    },
    enabled: !!id,
  });
};

export const useCreatePageMutation = (
  {
    pageName,
    parentPageId,
  }: {
    pageName: string;
    parentPageId: string | null;
  },
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageName, parentPageId }),
      });
      if (!response.ok) throw new Error("Failed to create page");
      const json: Page = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
    },
  });
};

export const useUpdatePageMutation = (
  {
    id,
    pageName,
    parentPageId,
    isFavourite,
  }: {
    id: string;
    pageName?: string;
    parentPageId?: string | null;
    isFavourite?: boolean;
  },
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(typeof pageName !== "undefined" && { pageName }),
          ...(typeof parentPageId !== "undefined" && { parentPageId }),
          ...(typeof isFavourite !== "undefined" && { isFavourite }),
        }),
      });
      if (!response.ok) throw new Error("Failed to update page");
      const json: Page = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const useDeletePageMutation = (id: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });
      if (!response.ok) throw new Error("Failed to delete page");
      const json: DeletedPage = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const usePermanentlyDeletePageMutation = (
  id: string,
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete page");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.removeQueries({ queryKey: ["page", id] });
    },
  });
};

export const useUndoDeletePageMutation = (
  id: string,
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: async () => {
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
    onMutate: () => {
      queryClient.fetchQuery({ queryKey: ["page", id] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};
