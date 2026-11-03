import { createFileRoute } from "@tanstack/react-router";
import { Payouts } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/payouts")({
  head: () => ({ meta: [{"title": "Verified Payouts — IndiFunded"}, {"name": "description", "content": "Real payouts to real IndiFunded traders, processed within 24 hours."}, {"property": "og:title", "content": "Verified Payouts — IndiFunded"}, {"property": "og:description", "content": "Real payouts to real IndiFunded traders, processed within 24 hours."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Payouts,
});
