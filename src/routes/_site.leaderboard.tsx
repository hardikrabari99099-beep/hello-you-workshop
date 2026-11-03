import { createFileRoute } from "@tanstack/react-router";
import Leaderboard from "@/views/Leaderboard";

export const Route = createFileRoute("/_site/leaderboard")({
  head: () => ({ meta: [{"title": "Top Funded Traders — IndiFunded"}, {"name": "description", "content": "See the IndiFunded leaderboard of top-earning funded traders across India."}, {"property": "og:title", "content": "Top Funded Traders — IndiFunded"}, {"property": "og:description", "content": "See the IndiFunded leaderboard of top-earning funded traders across India."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Leaderboard,
});
