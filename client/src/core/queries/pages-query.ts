import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "#src/lib/api.ts";

type View = "all" | "pinned" | "trash" | "tags";

const queryKeyFactory = (spaceId: string, view?: View, tags?: string[]) => {
  const normalizedTags = tags?.length ? [...tags].sort() : undefined;

  return [
    "pages",
    spaceId,
    ...(view
      ? [
          {
            view,
            tags: normalizedTags,
          },
        ]
      : []),
  ];
};

export const pagesQueryOptions = (spaceId: string, view?: View, tags?: string[]) =>
  queryOptions({
    queryKey: queryKeyFactory(spaceId, view, tags),

    queryFn: async () => {
      const res = await apiClient.spaces[":spaceId"].pages.$get({
        param: { spaceId },
        query:
          !view || view === "all"
            ? {}
            : {
                pinned: view === "pinned" ? true : undefined,
                deleted: view === "trash" ? true : undefined,
                tags: view === "tags" && tags ? tags : undefined,
              },
      });

      if (!res.ok) throw new Error();
      return res.json();
    },
  });
