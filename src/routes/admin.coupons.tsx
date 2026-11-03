import { createFileRoute } from "@tanstack/react-router";
import { AdminCoupons } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/coupons")({
  ssr: false,
  component: AdminCoupons,
});
