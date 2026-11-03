import { createFileRoute } from "@tanstack/react-router";
import Challenges from "@/views/Challenges";

export const Route = createFileRoute("/_site/challenges")({
  head: () => ({ meta: [{"title": "Challenge Plans — IndiFunded"}, {"name": "description", "content": "Compare IndiFunded challenge plans from ₹1L to ₹7L funded accounts and start your evaluation today."}, {"property": "og:title", "content": "Challenge Plans — IndiFunded"}, {"property": "og:description", "content": "Compare IndiFunded challenge plans from ₹1L to ₹7L funded accounts and start your evaluation today."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Challenges,
});
