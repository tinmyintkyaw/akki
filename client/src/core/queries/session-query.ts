import { queryOptions } from "@tanstack/react-query";

import { authClient } from "#src/lib/auth.ts";

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ["session"] as const,
    queryFn: async () => {
      const { data: session } = await authClient.getSession();
      return session;
    },

    staleTime: 1 * 60 * 1000,
  });
