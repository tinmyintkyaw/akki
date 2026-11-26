import { mutationOptions } from "@tanstack/react-query";

import { pageQueryOptions } from "#src/core/queries/page-query.ts";
import { pagesQueryOptions } from "#src/core/queries/pages-query.ts";
import { apiClient } from "#src/lib/api.ts";
import { queryClient } from "#src/lib/query.ts";

type EditPageInput = {
  name?: string;
  isPinned?: boolean;
  isDeleted?: boolean;
};

export const updatePageMutationOptions = (spaceId: string, pageId: string) =>
  mutationOptions({
    mutationKey: ["page", "edit", pageId],
    mutationFn: async ({ name, isPinned, isDeleted }: EditPageInput) => {
      const res = await apiClient.spaces[":spaceId"].pages[":pageId"].$patch({
        param: { spaceId, pageId },
        json: {
          name,
          isPinned,
          isDeleted,
        },
      });

      if (!res.ok) throw new Error();
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesQueryOptions(spaceId).queryKey });
      queryClient.invalidateQueries({ queryKey: pageQueryOptions(spaceId, pageId).queryKey });
    },
  });
