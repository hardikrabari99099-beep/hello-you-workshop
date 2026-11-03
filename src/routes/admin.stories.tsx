import { createFileRoute } from "@tanstack/react-router";
import { AdminStories } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/stories")({
  ssr: false,
  component: AdminStories,
});
