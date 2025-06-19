import EditorLayout from "@/components/EditorLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/page/$pageId")({
  component: EditorLayout,
});
