import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({ meta: [{ title: "Terms and Conditions — IndiFunded" }, { name: "description", content: "The terms that apply to IndiFunded challenges and funded accounts." }, { property: "og:title", content: "Terms and Conditions — IndiFunded" }, { property: "og:description", content: "The terms that apply to IndiFunded challenges and funded accounts." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <PolicyPage kind="terms" />,
});
