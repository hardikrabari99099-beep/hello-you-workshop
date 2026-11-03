import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

// Same-origin API (implemented in src/routes/api/$.ts).
export const API = "/api";

export const api = axios.create({ baseURL: API, withCredentials: false });

// Attach the signed-in user's session token.
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { data } = await supabase.auth.getSession();
    const t = data.session?.access_token;
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
