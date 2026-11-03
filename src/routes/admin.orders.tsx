import { createFileRoute } from "@tanstack/react-router";
import { AdminOrders } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  component: AdminOrders,
});
