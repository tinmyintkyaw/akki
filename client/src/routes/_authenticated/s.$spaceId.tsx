import { App } from "#src/core/components/App.tsx";
import { spaceQueryOptions } from "#src/core/queries/space-query.ts";
import { queryClient } from "#src/lib/query.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const PAGE_FILTER_OPTIONS = ["all", "trash", "pinned"] as const;

const searchScheme = z.xor([
  z.object({
    p: z.enum(PAGE_FILTER_OPTIONS).default("all"),
  }),
  z.object({ t: z.uuid() }),
]);

export const Route = createFileRoute("/_authenticated/s/$spaceId")({
  validateSearch: searchScheme,
  // search: { middlewares: [stripSearchParams({ p: "all" })] },

  beforeLoad: async ({ params }) => {
    const { spaceId } = params;

    // check if spaceId is valid
    try {
      const space = await queryClient.query(spaceQueryOptions(spaceId));

      return { space };
    } catch {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },

  component: () => <App />,
});
