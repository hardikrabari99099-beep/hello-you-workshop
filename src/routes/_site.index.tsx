import { createFileRoute } from "@tanstack/react-router";
import Home from "@/views/Home";

export const Route = createFileRoute("/_site/")({
  head: () => ({ meta: [{"title": "IndiFunded — India's 1st Prop Trading Firm"}, {"name": "description", "content": "Pass the challenge, get funded up to ₹5,00,000. Trade NSE, BankNifty and Nifty50 with a 70% profit split and 24-hour payouts."}, {"property": "og:title", "content": "IndiFunded — India's 1st Prop Trading Firm"}, {"property": "og:description", "content": "Pass the challenge, get funded up to ₹5,00,000. Trade NSE, BankNifty and Nifty50 with a 70% profit split and 24-hour payouts."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Home,
});
