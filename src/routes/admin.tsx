import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/views/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{"title": "Admin — IndiFunded"}, {"name": "description", "content": "IndiFunded admin panel."}, {"property": "og:title", "content": "Admin — IndiFunded"}, {"property": "og:description", "content": "IndiFunded admin panel."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: AdminLayout,
});
