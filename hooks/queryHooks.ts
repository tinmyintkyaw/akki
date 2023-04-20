import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const usePageListQuery = () => {
  return useQuery({
    queryKey: ["pageList"],
    queryFn: async () => {
      const response = await fetch("/api/pages");
      if (!response.ok) throw new Error("Failed to fetch pages");
      return response.json();
    },
  });
};

export const useRecentPagesQuery = () => {
  return useQuery({
    queryKey: ["recentPages"],
    queryFn: async () => {
      const response = await fetch("/api/pages/recent");
      if (!response.ok) throw new Error("Failed to fetch recent pages");
      return response.json();
    },
  });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      const response = await fetch(`/api/pages/${id}`);
      if (!response.ok) throw new Error("Failed to fetch page");
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreatePageMutation = (
  pageName: string,
  parentPageId: string | null,
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
    },
  });
};

export const useUpdatePageMutation = ({
  id,
  pageName,
  parentPageId,
  isFavourite,
  queryClient,
}: {
  id: string;
  pageName?: string;
  parentPageId?: string | null;
  isFavourite?: boolean;
  queryClient: QueryClient;
}) => {
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
      return response.json();
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
      const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete page");
      return response;
    },
    onMutate: () => {
      queryClient.removeQueries({ queryKey: ["page", id] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
    },
  });
};
