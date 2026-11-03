import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});
