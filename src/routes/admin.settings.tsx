import { createFileRoute } from "@tanstack/react-router";
import AdminSettings from "@/views/admin/AdminSettings";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin settings management." }, { property: "og:title", content: "Settings — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin settings management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminSettings,
});
