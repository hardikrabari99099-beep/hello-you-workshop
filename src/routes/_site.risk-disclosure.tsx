import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/risk-disclosure")({
  head: () => ({ meta: [{ title: "Risk Disclosure — IndiFunded" }, { name: "description", content: "Important information about the risks of trading." }, { property: "og:title", content: "Risk Disclosure — IndiFunded" }, { property: "og:description", content: "Important information about the risks of trading." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <PolicyPage kind="risk" />,
});
