import { createFileRoute } from "@tanstack/react-router";
import { FAQ } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/faq")({
  head: () => ({ meta: [{"title": "FAQ — IndiFunded"}, {"name": "description", "content": "Answers about trust, challenge details, funded accounts and payouts at IndiFunded."}, {"property": "og:title", "content": "FAQ — IndiFunded"}, {"property": "og:description", "content": "Answers about trust, challenge details, funded accounts and payouts at IndiFunded."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: FAQ,
});
