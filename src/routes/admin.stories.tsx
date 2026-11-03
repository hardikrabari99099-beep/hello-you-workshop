import { createFileRoute } from "@tanstack/react-router";
import { AdminStories } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/stories")({
  ssr: false,
  head: () => ({ meta: [{ title: "Stories — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin stories management." }, { property: "og:title", content: "Stories — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin stories management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminStories,
});
