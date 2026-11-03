import { createFileRoute } from "@tanstack/react-router";
import UserAccounts from "@/views/app/UserAccounts";

export const Route = createFileRoute("/app/accounts")({
  ssr: false,
  head: () => ({ meta: [{"title": "My Accounts — IndiFunded"}, {"name": "description", "content": "Your IndiFunded challenge and funded accounts."}, {"property": "og:title", "content": "My Accounts — IndiFunded"}, {"property": "og:description", "content": "Your IndiFunded challenge and funded accounts."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: UserAccounts,
});
