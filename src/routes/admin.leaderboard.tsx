import { createFileRoute } from "@tanstack/react-router";
import { AdminLeaderboard } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/leaderboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Leaderboard — IndiFunded Admin" }, { name: "description", content: "IndiFunded admin leaderboard management." }, { property: "og:title", content: "Leaderboard — IndiFunded Admin" }, { property: "og:description", content: "IndiFunded admin leaderboard management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminLeaderboard,
});
