import { createFileRoute } from "@tanstack/react-router";
import Login from "@/views/Login";

export const Route = createFileRoute("/_site/login")({
  head: () => ({ meta: [{"title": "Sign In — IndiFunded"}, {"name": "description", "content": "Sign in or create your IndiFunded trader account."}, {"property": "og:title", "content": "Sign In — IndiFunded"}, {"property": "og:description", "content": "Sign in or create your IndiFunded trader account."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: Login,
});
