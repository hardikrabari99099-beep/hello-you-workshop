import { createFileRoute } from "@tanstack/react-router";
import { BlogDetail } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/blog/$slug")({
  head: () => ({ meta: [{"title": "Article — IndiFunded Blog"}, {"name": "description", "content": "Read this article on the IndiFunded trading blog."}, {"property": "og:title", "content": "Article — IndiFunded Blog"}, {"property": "og:description", "content": "Read this article on the IndiFunded trading blog."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: BlogDetail,
});
