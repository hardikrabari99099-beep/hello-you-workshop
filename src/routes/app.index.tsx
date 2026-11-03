import { createFileRoute } from "@tanstack/react-router";
import UserDashboard from "@/views/app/UserDashboard";

export const Route = createFileRoute("/app/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — IndiFunded Trader" }, { name: "description", content: "IndiFunded trader dashboard management." }, { property: "og:title", content: "Dashboard — IndiFunded Trader" }, { property: "og:description", content: "IndiFunded trader dashboard management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: UserDashboard,
});
