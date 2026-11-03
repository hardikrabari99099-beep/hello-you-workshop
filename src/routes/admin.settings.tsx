import { createFileRoute } from "@tanstack/react-router";
import AdminSettings from "@/views/admin/AdminSettings";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: AdminSettings,
});
