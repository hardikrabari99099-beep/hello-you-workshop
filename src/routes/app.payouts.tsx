import { createFileRoute } from "@tanstack/react-router";
import UserPayouts from "@/views/app/UserPayouts";

export const Route = createFileRoute("/app/payouts")({
  ssr: false,
  head: () => ({ meta: [{"title": "My Payouts — IndiFunded"}, {"name": "description", "content": "Your IndiFunded payout history."}, {"property": "og:title", "content": "My Payouts — IndiFunded"}, {"property": "og:description", "content": "Your IndiFunded payout history."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: UserPayouts,
});
