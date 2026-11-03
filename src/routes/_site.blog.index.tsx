import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/blog/")({
  head: () => ({ meta: [{"title": "Blog — IndiFunded"}, {"name": "description", "content": "Trading insights, strategies and news from the IndiFunded team."}, {"property": "og:title", "content": "Blog — IndiFunded"}, {"property": "og:description", "content": "Trading insights, strategies and news from the IndiFunded team."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Blog,
});
