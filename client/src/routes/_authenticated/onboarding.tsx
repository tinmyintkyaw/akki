import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

// oxlint-disable-next-line react/only-export-components
function Onboarding() {
  return <></>;
}
