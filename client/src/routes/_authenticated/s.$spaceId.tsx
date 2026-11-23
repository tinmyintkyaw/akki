import { App } from "#src/core/components/App.tsx";
import { spaceQueryOptions } from "#src/core/queries/space-query.ts";
import { queryClient } from "#src/lib/query.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/s/$spaceId")({
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
