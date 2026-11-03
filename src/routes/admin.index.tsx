import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin dashboard management." }, { property: "og:title", content: "Dashboard — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin dashboard management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminDashboard,
});
