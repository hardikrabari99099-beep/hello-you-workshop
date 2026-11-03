import { createFileRoute } from "@tanstack/react-router";
import { AdminPlans } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/plans")({
  ssr: false,
  head: () => ({ meta: [{ title: "Plans — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin plans management." }, { property: "og:title", content: "Plans — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin plans management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPlans,
});
