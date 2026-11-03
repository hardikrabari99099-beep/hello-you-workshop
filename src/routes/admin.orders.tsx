import { createFileRoute } from "@tanstack/react-router";
import { AdminOrders } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  head: () => ({ meta: [{ title: "Orders — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin orders management." }, { property: "og:title", content: "Orders — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin orders management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminOrders,
});
