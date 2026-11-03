import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — IndiFunded" }, { name: "description", content: "Get a link to reset your IndiFunded account password." }, { property: "og:title", content: "Forgot Password — IndiFunded" }, { property: "og:description", content: "Get a link to reset your IndiFunded account password." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ForgotPassword,
});
