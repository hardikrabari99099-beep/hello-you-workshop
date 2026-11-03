import { createFileRoute } from "@tanstack/react-router";
import { AdminLeague } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/league")({
  ssr: false,
  head: () => ({ meta: [{ title: "League — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin league management." }, { property: "og:title", content: "League — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin league management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminLeague,
});
