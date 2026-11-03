import { createFileRoute } from "@tanstack/react-router";
import { AdminPlans } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/plans")({
  ssr: false,
  component: AdminPlans,
});
