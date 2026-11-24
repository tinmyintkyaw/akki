import { createSpaceMutationOptions } from "#src/core/queries/create-space-mutation.ts";
import { queryClient } from "#src/lib/query.ts";
import { MutationObserver } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: async ({ context }) => {
    const latestSpace = context.spaces.at(-1);

    if (!latestSpace) {
      const spaceName = `${context.session.user.name}'s Space`;

      const observer = new MutationObserver(
        queryClient,
        createSpaceMutationOptions(),
      );

      const newSpace = await observer.mutate(spaceName);

      throw redirect({
        to: "/s/$spaceId/p/{-$pageId}",
        params: { spaceId: newSpace.id },
        replace: true,
      });
    } else {
      throw redirect({
        to: "/s/$spaceId/p/{-$pageId}",
        params: { spaceId: latestSpace.id },
        replace: true,
      });
    }
  },
});
