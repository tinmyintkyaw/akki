import { PageListResponse, PageResponse } from "@/types/queryResponse";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

class HTTPError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const usePageListQuery = () => {
  return useQuery({
    queryKey: ["pageList"],
    queryFn: async () => {
      const response = await fetch("/api/pages");
      if (!response.ok)
        throw new HTTPError("Failed to fetch pages", response.status);

      const json: PageListResponse = await response.json();
      return json;
    },
  });
};

export const useRecentPagesQuery = () => {
  return useQuery({
    queryKey: ["recentPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/recent");
      if (!response.ok)
        throw new HTTPError("Failed to fetch recent pages", response.status);
      const json: PageListResponse = await response.json();
      return json;
    },
  });
};

export const useDeletedPagesQuery = () => {
  return useQuery({
    queryKey: ["deletedPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/deleted");
      if (!response.ok)
        throw new HTTPError("Failed to fetch deleted pages", response.status);
      const json: PageListResponse = await response.json();
      return json;
    },
  });
};

export const useStarredPagesQuery = () => {
  return useQuery({
    queryKey: ["starredPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/starred");
      if (!response.ok)
        throw new HTTPError("Failed to fetch starred pages", response.status);
      const json: PageListResponse = await response.json();
      return json;
    },
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok)
        throw new HTTPError("Failed to fetch page", response.status);
      const json: PageResponse = await response.json();
      return json;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry(failureCount, error: HTTPError) {
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
      parentId?: string | null;
    }) => {
      const { pageName, parentId } = variables;

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageName, parentId }),
      });
      if (!response.ok)
        throw new HTTPError("Failed to create page", response.status);
      const json: PageResponse = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
    },
  });
};

export const useUpdatePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      pageName?: string;
      parentId?: string | null;
      isStarred?: boolean;
      accessedAt?: string;
    }) => {
      const { id, pageName, parentId, isStarred, accessedAt } = variables;

      const response = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageName,
          parentId,
          isStarred,
          accessedAt,
        }),
      });
      if (!response.ok)
        throw new HTTPError("Failed to update page", response.status);
      const json: PageResponse = await response.json();
      return json;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["starredPages"] });
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
      if (!response.ok)
        throw new HTTPError("Failed to delete page", response.status);
      const json: PageResponse = await response.json();
      return json;
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["starredPages"] });
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
      if (!response.ok)
        throw new HTTPError("Failed to delete page", response.status);
      return response;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
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
      if (!response.ok)
        throw new HTTPError("Failed to revert delete page", response.status);
      const json: PageResponse = await response.json();
      return json;
    },
    onMutate: ({ id }) => {
      queryClient.fetchQuery({ queryKey: ["page", id] });
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["starredPages"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};
