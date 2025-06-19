import { authClient } from "@/authClient";
import Signin from "@/components/Signin";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Signin,
});
