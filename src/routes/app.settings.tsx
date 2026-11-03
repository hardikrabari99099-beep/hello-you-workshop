import { createFileRoute } from "@tanstack/react-router";
import UserSettings from "@/views/app/UserSettings";

export const Route = createFileRoute("/app/settings")({
  ssr: false,
  head: () => ({ meta: [{"title": "Account Settings — IndiFunded"}, {"name": "description", "content": "Manage your IndiFunded profile and KYC."}, {"property": "og:title", "content": "Account Settings — IndiFunded"}, {"property": "og:description", "content": "Manage your IndiFunded profile and KYC."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: UserSettings,
});
