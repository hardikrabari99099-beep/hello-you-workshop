import { createFileRoute } from "@tanstack/react-router";
import { TraderStories } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/stories")({
  head: () => ({ meta: [{ title: "Trader Stories — IndiFunded" }, { name: "description", content: "Real experiences and video reviews from funded IndiFunded traders." }, { property: "og:title", content: "Trader Stories — IndiFunded" }, { property: "og:description", content: "Real experiences and video reviews from funded IndiFunded traders." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: TraderStories,
});
