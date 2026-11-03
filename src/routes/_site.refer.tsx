import { createFileRoute } from "@tanstack/react-router";
import Referral from "@/views/Referral";

export const Route = createFileRoute("/_site/refer")({
  head: () => ({ meta: [{"title": "Refer & Earn — IndiFunded"}, {"name": "description", "content": "Get your referral code and earn when fellow traders join an IndiFunded challenge."}, {"property": "og:title", "content": "Refer & Earn — IndiFunded"}, {"property": "og:description", "content": "Get your referral code and earn when fellow traders join an IndiFunded challenge."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Referral,
});
