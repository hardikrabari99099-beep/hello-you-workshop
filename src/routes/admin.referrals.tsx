import { createFileRoute } from "@tanstack/react-router";
import { AdminReferrals } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/referrals")({
  ssr: false,
  component: AdminReferrals,
});
