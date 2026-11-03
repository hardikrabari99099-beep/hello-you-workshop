import { createFileRoute } from "@tanstack/react-router";
import UserDashboard from "@/views/app/UserDashboard";

export const Route = createFileRoute("/app/")({
  ssr: false,
  component: UserDashboard,
});
