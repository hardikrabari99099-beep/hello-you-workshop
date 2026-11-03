import { createFileRoute } from "@tanstack/react-router";
import { AdminLeague } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/league")({
  ssr: false,
  component: AdminLeague,
});
