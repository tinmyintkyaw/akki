import { queryOptions, skipToken } from "@tanstack/react-query";

import { apiClient } from "#src/lib/api.ts";

const fetchPage = async (spaceId: string, pageId: string) => {
  const res = await apiClient.spaces[":spaceId"].pages[":pageId"].$get({
    param: {
      spaceId,
      pageId,
    },
  });
  if (!res.ok) throw new Error();
  return res.json();
};

export const pageQueryOptions = (spaceId?: string, pageId?: string) =>
  queryOptions({
    queryKey: ["page", pageId] as const,
    queryFn: spaceId && pageId ? () => fetchPage(spaceId, pageId) : skipToken,
    retry: false,
  });
