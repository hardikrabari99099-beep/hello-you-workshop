import { createFileRoute } from "@tanstack/react-router";
import { AdminLeaderboard } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/leaderboard")({
  ssr: false,
  component: AdminLeaderboard,
});
