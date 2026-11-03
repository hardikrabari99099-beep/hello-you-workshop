import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/about")({
  head: () => ({ meta: [{"title": "About IndiFunded"}, {"name": "description", "content": "Built for Indian traders, run by traders. Learn who we are and why IndiFunded exists."}, {"property": "og:title", "content": "About IndiFunded"}, {"property": "og:description", "content": "Built for Indian traders, run by traders. Learn who we are and why IndiFunded exists."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: About,
});
