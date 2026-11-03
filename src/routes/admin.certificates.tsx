import { createFileRoute } from "@tanstack/react-router";
import { AdminCertificates } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/certificates")({
  ssr: false,
  head: () => ({ meta: [{ title: "Certificates — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin certificates management." }, { property: "og:title", content: "Certificates — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin certificates management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminCertificates,
});
