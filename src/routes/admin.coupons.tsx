import { createFileRoute } from "@tanstack/react-router";
import { AdminCoupons } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/coupons")({
  ssr: false,
  head: () => ({ meta: [{ title: "Coupons — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin coupons management." }, { property: "og:title", content: "Coupons — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin coupons management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminCoupons,
});
