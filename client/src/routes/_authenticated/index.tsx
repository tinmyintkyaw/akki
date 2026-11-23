import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: async ({ context }) => {
    const latestSpace = context.spaces.at(-1);

    if (!latestSpace) throw redirect({ to: "/onboarding" });

    throw redirect({
      to: "/s/$spaceId/p/{-$pageId}",
      params: { spaceId: latestSpace.id },
      replace: true,
    });
  },
});
