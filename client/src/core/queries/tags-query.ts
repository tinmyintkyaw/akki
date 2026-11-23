import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "#src/lib/api.ts";

export const tagsQueryOptions = (spaceId: string) =>
  queryOptions({
    queryKey: ["tags", spaceId] as const,
    queryFn: async () => {
      const res = await apiClient.spaces[":spaceId"].tags.$get({ param: { spaceId } });
      if (!res.ok) throw new Error();
      return res.json();
    },
  });
