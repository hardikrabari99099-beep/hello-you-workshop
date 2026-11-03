import { createFileRoute } from "@tanstack/react-router";
import { AdminReferrals } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/referrals")({
  ssr: false,
  head: () => ({ meta: [{ title: "Referrals — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin referrals management." }, { property: "og:title", content: "Referrals — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin referrals management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminReferrals,
});
