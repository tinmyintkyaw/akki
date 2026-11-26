import { mutationOptions } from "@tanstack/react-query";

import { pageQueryOptions } from "#src/core/queries/page-query.ts";
import { pagesQueryOptions } from "#src/core/queries/pages-query.ts";
import { apiClient } from "#src/lib/api.ts";
import { queryClient } from "#src/lib/query.ts";

export const deletePageMutationOptions = (spaceId: string, pageId: string) =>
  mutationOptions({
    mutationKey: ["page", "delete", pageId],
    mutationFn: async () => {
      const res = await apiClient.spaces[":spaceId"].pages[":pageId"].$delete({
        param: { spaceId, pageId },
      });

      if (!res.ok) throw new Error();
      return;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesQueryOptions(spaceId).queryKey });
      queryClient.removeQueries({ queryKey: pageQueryOptions(spaceId, pageId).queryKey });
    },
  });
