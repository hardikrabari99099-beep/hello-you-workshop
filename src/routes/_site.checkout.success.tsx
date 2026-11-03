import { createFileRoute } from "@tanstack/react-router";
import CheckoutSuccess from "@/views/CheckoutSuccess";

export const Route = createFileRoute("/_site/checkout/success")({
  head: () => ({ meta: [{"title": "Payment Received — IndiFunded"}, {"name": "description", "content": "Your IndiFunded challenge payment status."}, {"property": "og:title", "content": "Payment Received — IndiFunded"}, {"property": "og:description", "content": "Your IndiFunded challenge payment status."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: CheckoutSuccess,
});
