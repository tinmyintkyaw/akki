import { queryOptions } from "@tanstack/react-query";

import { authClient } from "#src/lib/auth.ts";

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ["session"] as const,
    queryFn: async () => {
      const { data: session, error } = await authClient.getSession();
      if (error) throw error;
      return session;
    },

    staleTime: 1 * 60 * 1000,
  });
