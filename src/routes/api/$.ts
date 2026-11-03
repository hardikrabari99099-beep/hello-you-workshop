import { createFileRoute } from "@tanstack/react-router";

// All /api/* calls from the site (and the Razorpay webhook at /api/webhooks/razorpay).
async function handle({ request, params }: { request: Request; params: { _splat?: string } }) {
  const { handleApi } = await import("@/server/api-handler");
  return handleApi(request, params._splat ?? "");
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
});
