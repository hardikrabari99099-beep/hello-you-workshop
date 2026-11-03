import { createFileRoute } from "@tanstack/react-router";
import { AdminPayoutRequests } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/payouts")({
  ssr: false,
  component: AdminPayoutRequests,
});
