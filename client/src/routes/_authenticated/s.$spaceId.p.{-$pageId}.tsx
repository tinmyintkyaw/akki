import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/s/$spaceId/p/{-$pageId}")(
  {},
);
