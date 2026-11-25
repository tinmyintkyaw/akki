import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "#src/lib/api.ts";

export const pagesQueryOptions = (
  spaceId: string,
  pinned?: boolean,
  deleted?: boolean,
  tags?: string[],
) =>
  queryOptions({
    queryKey: ["pages", { pinned: pinned ?? false, trash: deleted ?? false, tags }] as const,
    queryFn: async () => {
      const res = await apiClient.spaces[":spaceId"].pages.$get({
        param: { spaceId },
        query: {
          pinned,
          deleted,
          tags,
        },
      });

      if (!res.ok) throw new Error();
      return res.json();
    },
  });
