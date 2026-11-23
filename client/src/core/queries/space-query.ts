import { queryOptions } from "@tanstack/react-query";

import { authClient } from "#src/lib/auth.ts";
import { ApiError } from "#src/lib/query.ts";

export const spaceQueryOptions = (spaceId: string) =>
  queryOptions({
    queryKey: ["space", spaceId] as const,
    queryFn: async () => {
      const { data: space, error } = await authClient.organization.getOrganization({
        query: { organizationId: spaceId },
      });
      if (error) throw new ApiError(error.status, error.statusText);
      return space;
    },
    retry: false,
  });
