import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "#src/lib/query.ts";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
  beforeLoad: async () => {
    const session = await queryClient.query(sessionQueryOptions());

    if (session) throw redirect({ to: "/", replace: true });
  },
});

// oxlint-disable-next-line react/only-export-components
function SignIn() {
  return <></>;
}
