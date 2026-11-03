import { createFileRoute } from "@tanstack/react-router";
import { AdminWeeklyPayouts } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/weekly-payouts")({
  ssr: false,
  head: () => ({ meta: [{ title: "Weekly Payouts — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin weekly payouts management." }, { property: "og:title", content: "Weekly Payouts — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin weekly payouts management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminWeeklyPayouts,
});
