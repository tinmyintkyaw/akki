import { useMemo } from "react";
import { usePageListQuery } from "@/hooks/pageQueryHooks";
import { PageResponse } from "@/shared/types/queryResponse";

const getParentPageIds = (
  pageId: string,
  pageListMap: Map<string, PageResponse>,
  result: string[],
) => {
  const page = pageListMap.get(pageId);
  if (!page || !page.parentId) return result;
  result.push(page.parentId);
  getParentPageIds(page.parentId, pageListMap, result);
  return result;
};

const useParentPageIds = (currentPageId: string) => {
  const pageListQuery = usePageListQuery();

  const pageListMap = useMemo(() => {
    if (currentPageId.length === 0) return null;
    if (pageListQuery.isLoading || pageListQuery.isError) return null;
    return new Map(pageListQuery.data.map((page) => [page.id, { ...page }]));
  }, [
    currentPageId.length,
    pageListQuery.data,
    pageListQuery.isError,
    pageListQuery.isLoading,
  ]);

  return useMemo(() => {
    if (!pageListMap) return null;
    return getParentPageIds(currentPageId, pageListMap, []);
  }, [currentPageId, pageListMap]);
};

export default useParentPageIds;
