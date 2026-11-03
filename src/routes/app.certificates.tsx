import { createFileRoute } from "@tanstack/react-router";
import UserCertificates from "@/views/app/UserCertificates";

export const Route = createFileRoute("/app/certificates")({
  ssr: false,
  head: () => ({ meta: [{"title": "My Certificates — IndiFunded"}, {"name": "description", "content": "Your IndiFunded payout certificates."}, {"property": "og:title", "content": "My Certificates — IndiFunded"}, {"property": "og:description", "content": "Your IndiFunded payout certificates."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}, {"name": "robots", "content": "noindex"}] }),
  component: UserCertificates,
});
