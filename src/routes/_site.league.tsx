import { createFileRoute } from "@tanstack/react-router";
import TraderLeague from "@/views/TraderLeague";

export const Route = createFileRoute("/_site/league")({
  head: () => ({ meta: [{"title": "Trader League — IndiFunded"}, {"name": "description", "content": "Register for the IndiFunded Trader League and compete with India's best traders."}, {"property": "og:title", "content": "Trader League — IndiFunded"}, {"property": "og:description", "content": "Register for the IndiFunded Trader League and compete with India's best traders."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: TraderLeague,
});
