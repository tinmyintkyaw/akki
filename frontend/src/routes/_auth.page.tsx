import Layout from "@/components/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/page")({
  component: Layout,
});
