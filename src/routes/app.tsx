import { createFileRoute } from "@tanstack/react-router";
import UserDashboardLayout from "@/views/app/UserDashboardLayout";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({ meta: [{"title": "Trader Dashboard — IndiFunded"}, {"name": "description", "content": "Your IndiFunded trader dashboard."}, {"property": "og:title", "content": "Trader Dashboard — IndiFunded"}, {"property": "og:description", "content": "Your IndiFunded trader dashboard."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: UserDashboardLayout,
});
