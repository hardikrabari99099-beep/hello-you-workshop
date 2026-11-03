import { createFileRoute } from "@tanstack/react-router";
import { VerifyPayout } from "@/views/ExtraPages";

export const Route = createFileRoute("/_site/verify-payout")({
  head: () => ({ meta: [{ title: "Verify a Payout — IndiFunded" }, { name: "description", content: "Check any IndiFunded payout certificate by ID or trader name." }, { property: "og:title", content: "Verify a Payout — IndiFunded" }, { property: "og:description", content: "Check any IndiFunded payout certificate by ID or trader name." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: VerifyPayout,
});
