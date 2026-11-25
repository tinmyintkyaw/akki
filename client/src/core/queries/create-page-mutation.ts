import { mutationOptions } from "@tanstack/react-query";

import { pagesQueryOptions } from "#src/core/queries/pages-query.ts";
import { apiClient } from "#src/lib/api.ts";
import { queryClient } from "#src/lib/query.ts";

export const createPageMutationOptions = (spaceId: string) =>
  mutationOptions({
    mutationKey: ["page", "create"],
    mutationFn: async (name?: string) => {
      const res = await apiClient.spaces[":spaceId"].pages.$post({
        param: { spaceId },
        json: {
          name: name ? name : "New Page",
        },
      });

      if (!res.ok) throw new Error();
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesQueryOptions(spaceId).queryKey });
    },
  });
