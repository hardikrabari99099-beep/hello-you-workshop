import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy — IndiFunded" }, { name: "description", content: "When IndiFunded challenge fees can be refunded." }, { property: "og:title", content: "Refund Policy — IndiFunded" }, { property: "og:description", content: "When IndiFunded challenge fees can be refunded." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <PolicyPage kind="refund" />,
});
