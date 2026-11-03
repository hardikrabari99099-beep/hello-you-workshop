import { createFileRoute } from "@tanstack/react-router";
import { AdminUsers } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({ meta: [{ title: "Users — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin users management." }, { property: "og:title", content: "Users — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin users management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminUsers,
});
