import { createFileRoute } from "@tanstack/react-router";
import { AdminLeads } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  head: () => ({ meta: [{ title: "Leads — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin leads management." }, { property: "og:title", content: "Leads — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin leads management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminLeads,
});
