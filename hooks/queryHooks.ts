import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

const getPageList = async () => {
  const response = await fetch("/api/pages");
  if (!response.ok) throw new Error("Failed to fetch pages");
  return response.json();
};

const createPage = async (pageName: string, parentPageId: string | null) => {
  const response = await fetch("/api/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageName, parentPageId }),
  });
  if (!response.ok) throw new Error("Failed to create page");
  return response.json();
};

const updatePage = async (
  id: string,
  pageName: string,
  parentPageId: string | null
) => {
  const response = await fetch(`/api/pages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageName, parentPageId }),
  });
  if (!response.ok) throw new Error("Failed to update page");
  return response.json();
};

const getPage = async (id: string) => {
  const response = await fetch(`/api/pages/${id}`);
  if (!response.ok) throw new Error("Failed to fetch page");
  return response.json();
};

const deletePage = async (id: string) => {
  const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete page");
  return response;
};

export const usePageListQuery = () => {
  return useQuery({ queryKey: ["pageList"], queryFn: getPageList });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: () => getPage(id),
    enabled: !!id,
  });
};

export const useCreatePageMutation = (
  pageName: string,
  parentPageId: string | null,
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => createPage(pageName, parentPageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
    },
  });
};

export const useUpdatePageMutation = (
  id: string,
  pageName: string,
  parentPageId: string | null,
  queryClient: QueryClient
) => {
  return useMutation({
    mutationFn: () => updatePage(id, pageName, parentPageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const useDeletePageMutation = (id: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: () => deletePage(id),
    onMutate: () => {
      queryClient.removeQueries({ queryKey: ["page", id] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
    },
  });
};
