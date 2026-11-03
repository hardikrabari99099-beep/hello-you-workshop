import { createFileRoute } from "@tanstack/react-router";
import { AdminBlogs } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/blogs")({
  ssr: false,
  component: AdminBlogs,
});
