import {
  createPage,
  deletePage,
  permanentlyDeletePage,
  undoDeletePage,
  updatePage,
} from "@/utils/mutationFunctions";
import {
  getDeletedPageList,
  getPageById,
  getPageList,
  getRecentPageList,
  getStarredPageList,
} from "@/utils/queryFunctions";
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
    queryFn: getPageList,
  });
};

export const useRecentPagesQuery = () => {
  return useQuery({
    queryKey: ["recentPages"],
    queryFn: getRecentPageList,
  });
};

export const useDeletedPagesQuery = () => {
  return useQuery({
    queryKey: ["deletedPages"],
    queryFn: getDeletedPageList,
  });
};

export const useStarredPagesQuery = () => {
  return useQuery({
    queryKey: ["starredPages"],
    queryFn: getStarredPageList,
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });
};

export const usePageQuery = (id: string) => {
  return useQuery({
    queryKey: ["page", id],
    queryFn: () => getPageById(id),
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
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
    },
  });
};

export const useUpdatePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updatePage,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["starredPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};

export const useDeletePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: deletePage,
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
    mutationFn: permanentlyDeletePage,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.removeQueries({ queryKey: ["page", id] });
    },
  });
};

export const useUndoDeletePageMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: undoDeletePage,
    onMutate: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["pageList"] });
      queryClient.invalidateQueries({ queryKey: ["starredPages"] });
      queryClient.invalidateQueries({ queryKey: ["deletedPages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
    },
  });
};
