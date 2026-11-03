import { createFileRoute } from "@tanstack/react-router";
import { TrustCenter } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/trust")({
  head: () => ({ meta: [{ title: "Trust Center — IndiFunded" }, { name: "description", content: "IndiFunded company details and live, verified platform statistics." }, { property: "og:title", content: "Trust Center — IndiFunded" }, { property: "og:description", content: "IndiFunded company details and live, verified platform statistics." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: TrustCenter,
});
