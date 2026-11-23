import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "#src/lib/query.ts";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { Signin } from "#src/core/components/Signin.tsx";

export const Route = createFileRoute("/sign-in")({
  component: Signin,
  beforeLoad: async () => {
    const session = await queryClient.query(sessionQueryOptions());

    if (session) throw redirect({ to: "/", replace: true });
  },
});
