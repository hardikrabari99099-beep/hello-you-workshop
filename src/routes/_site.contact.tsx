import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/views/SimplePages";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({ meta: [{"title": "Contact IndiFunded"}, {"name": "description", "content": "Reach the IndiFunded team by email, phone or WhatsApp."}, {"property": "og:title", "content": "Contact IndiFunded"}, {"property": "og:description", "content": "Reach the IndiFunded team by email, phone or WhatsApp."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Contact,
});
