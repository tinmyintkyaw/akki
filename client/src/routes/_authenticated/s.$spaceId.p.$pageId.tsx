import { pageQueryOptions } from "#src/core/queries/page-query.ts";
import { queryClient } from "#src/lib/query.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/s/$spaceId/p/$pageId")({
  beforeLoad: async ({ params }) => {
    const { spaceId, pageId } = params;

    try {
      if (!pageId) return;

      const page = await queryClient.query(pageQueryOptions(spaceId, pageId));

      if (!page)
        throw redirect({
          to: "/s/$spaceId",
          params: { spaceId },
          replace: true,
        });

      return { page };
    } catch {
      throw redirect({
        to: "/s/$spaceId",
        params: { spaceId },
        replace: true,
      });
    }
  },
});
