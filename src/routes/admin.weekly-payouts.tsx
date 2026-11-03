import { createFileRoute } from "@tanstack/react-router";
import { AdminWeeklyPayouts } from "@/views/admin/AdminPages";

export const Route = createFileRoute("/admin/weekly-payouts")({
  ssr: false,
  component: AdminWeeklyPayouts,
});
