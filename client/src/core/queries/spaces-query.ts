import { queryOptions } from "@tanstack/react-query";

import { authClient } from "#src/lib/auth.ts";

export const spacesQueryOptions = () =>
  queryOptions({
    queryKey: ["spaces"] as const,
    queryFn: async () => {
      const { data: spaces, error } = await authClient.organization.list();
      if (error) throw error;
      return spaces;
    },
    staleTime: 1 * 60 * 1000,
  });
