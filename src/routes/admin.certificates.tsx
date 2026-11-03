import { createFileRoute } from "@tanstack/react-router";
import { AdminCertificates } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/certificates")({
  ssr: false,
  component: AdminCertificates,
});
