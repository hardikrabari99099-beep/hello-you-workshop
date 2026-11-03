import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — IndiFunded" }, { name: "description", content: "How IndiFunded collects, uses and protects your personal data." }, { property: "og:title", content: "Privacy Policy — IndiFunded" }, { property: "og:description", content: "How IndiFunded collects, uses and protects your personal data." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <PolicyPage kind="privacy" />,
});
