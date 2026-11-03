import { createFileRoute } from "@tanstack/react-router";
import { AdminLeads } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  component: AdminLeads,
});
