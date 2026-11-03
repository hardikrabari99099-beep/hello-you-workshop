import { createFileRoute } from "@tanstack/react-router";
import PayoutRequest from "@/views/PayoutRequest";

export const Route = createFileRoute("/_site/payout-request")({
  head: () => ({ meta: [{"title": "Request a Payout — IndiFunded"}, {"name": "description", "content": "Funded traders can request their profit payout via UPI or bank transfer."}, {"property": "og:title", "content": "Request a Payout — IndiFunded"}, {"property": "og:description", "content": "Funded traders can request their profit payout via UPI or bank transfer."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PayoutRequest,
});
