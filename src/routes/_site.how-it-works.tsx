import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/how-it-works")({
  head: () => ({ meta: [{ title: "How It Works — IndiFunded" }, { name: "description", content: "Buy a challenge, pass the evaluation, get funded and withdraw your profit share." }, { property: "og:title", content: "How It Works — IndiFunded" }, { property: "og:description", content: "Buy a challenge, pass the evaluation, get funded and withdraw your profit share." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HowItWorksPage,
});
