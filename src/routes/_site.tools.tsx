import { createFileRoute } from "@tanstack/react-router";
import Tools from "@/views/Tools";

export const Route = createFileRoute("/_site/tools")({
  head: () => ({ meta: [{"title": "Trading Tools — IndiFunded"}, {"name": "description", "content": "Free calculators for position sizing, risk and profit planning for Indian traders."}, {"property": "og:title", "content": "Trading Tools — IndiFunded"}, {"property": "og:description", "content": "Free calculators for position sizing, risk and profit planning for Indian traders."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Tools,
});
