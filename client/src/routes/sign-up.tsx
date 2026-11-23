import { Signup } from "#src/core/components/Signup.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: Signup,
});
