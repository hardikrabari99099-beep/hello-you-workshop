import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — IndiFunded" }, { name: "description", content: "Choose a new password for your IndiFunded account." }, { property: "og:title", content: "Reset Password — IndiFunded" }, { property: "og:description", content: "Choose a new password for your IndiFunded account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ResetPassword,
});
