import { authClient } from "@/authClient";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    console.log(session);
    if (!session.data) {
      throw redirect({
        to: "/signin",
      });
    }
  },

  component: () => (
    <>
      <Outlet />
    </>
  ),
});
