import { createFileRoute } from "@tanstack/react-router";
import { Rules } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/rules")({
  head: () => ({ meta: [{"title": "Challenge Rules — IndiFunded"}, {"name": "description", "content": "Simple, realistic, trader-first rules: profit target, max loss, trading days and trade limits."}, {"property": "og:title", "content": "Challenge Rules — IndiFunded"}, {"property": "og:description", "content": "Simple, realistic, trader-first rules: profit target, max loss, trading days and trade limits."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Rules,
});
