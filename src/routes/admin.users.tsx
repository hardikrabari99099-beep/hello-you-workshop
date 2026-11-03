import { createFileRoute } from "@tanstack/react-router";
import { AdminUsers } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: AdminUsers,
});
