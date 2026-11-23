import { createFileRoute, redirect } from "@tanstack/react-router";
import { spacesQueryOptions } from "#src/core/queries/spaces-query.ts";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { queryClient } from "#src/lib/query.ts";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const session = await queryClient.query(sessionQueryOptions());

    if (!session) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }

    const spaces = await queryClient.query(spacesQueryOptions());

    const latestSpace = spaces.at(-1);
    const isOnboarding = location.pathname === "/onboarding";

    if (!latestSpace && !isOnboarding) {
      throw redirect({ to: "/onboarding", replace: true });
    }

    if (latestSpace && isOnboarding) {
      throw redirect({
        to: "/s/$spaceId/p/{-$pageId}",
        params: { spaceId: latestSpace.id },
        replace: true,
      });
    }

    return { session, spaces };
  },
});
