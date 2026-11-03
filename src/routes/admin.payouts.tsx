import { createFileRoute } from "@tanstack/react-router";
import { AdminPayoutRequests } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/payouts")({
  ssr: false,
  head: () => ({ meta: [{ title: "Payouts — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin payouts management." }, { property: "og:title", content: "Payouts — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin payouts management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPayoutRequests,
});
