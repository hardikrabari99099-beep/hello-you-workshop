// Server-side port of the original FastAPI backend (backend/server.py).
// Data lives in public.docs (one JSON document per row, grouped by collection).
// Only imported dynamically from src/routes/api/$.ts so it never reaches the browser.
import { DEFAULT_SETTINGS } from "../lib/default-settings";

const RAZORPAY_BASE = "https://api.razorpay.com/v1";
const LEAGUE_FEE_EXISTING = 999.0;
const LEAGUE_FEE_NEW = 1499.0;

class HttpError extends Error {
  constructor(status, detail) {
    super(typeof detail === "string" ? detail : "error");
    this.status = status;
    this.detail = detail;
  }
}
const fail = (status, detail) => {
  throw new HttpError(status, detail);
};
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const json = (data, status = 200) =>
  new Response(JSON.stringify(data ?? null), { status, headers: { "content-type": "application/json" } });

function env(name) {
  return process.env[name] || "";
}

// ---------- document store ----------
function store(sb) {
  const all = async (col) => {
    const out = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from("docs").select("data").eq("collection", col).range(from, from + 999);
      if (error) throw error;
      out.push(...data.map((r) => r.data));
      if (data.length < 1000) break;
    }
    return out;
  };
  const get = async (col, id) => {
    const { data, error } = await sb.from("docs").select("data").eq("collection", col).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  };
  const put = async (col, doc) => {
    const { error } = await sb.from("docs").upsert({ collection: col, id: String(doc.id), data: doc });
    if (error) throw error;
    return doc;
  };
  const del = async (col, id) => {
    const { error } = await sb.from("docs").delete().eq("collection", col).eq("id", id);
    if (error) throw error;
  };
  const delAll = async (col) => {
    const { error } = await sb.from("docs").delete().eq("collection", col);
    if (error) throw error;
  };
  const findOne = async (col, pred) => (await all(col)).find(pred) || null;
  return { all, get, put, del, delAll, findOne };
}

const byDesc = (k) => (a, b) => String(b[k] ?? "").localeCompare(String(a[k] ?? ""));
const byNum = (k, dir = 1) => (a, b) => dir * ((Number(a[k]) || 0) - (Number(b[k]) || 0));

function mergeSettings(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) return override;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (base && typeof base[k] === "object" && !Array.isArray(base[k]) && v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = mergeSettings(base[k], v);
    } else out[k] = v;
  }
  return out;
}

// ---------- crypto ----------
async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, typeof message === "string" ? new TextEncoder().encode(message) : message);
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// ---------- razorpay ----------
function rzAuth() {
  const id = env("RAZORPAY_KEY_ID");
  const secret = env("RAZORPAY_KEY_SECRET");
  return { id, secret, header: "Basic " + btoa(`${id}:${secret}`) };
}
async function rz(method, path, body) {
  const { header } = rzAuth();
  let resp;
  try {
    resp = await fetch(RAZORPAY_BASE + path, {
      method,
      headers: { Authorization: header, "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    fail(502, `Razorpay request failed: ${e}`);
  }
  return resp;
}
function requireRazorpay() {
  const { id, secret } = rzAuth();
  if (!id || !secret) fail(500, "Razorpay is not configured");
}

// ---------- validation helpers ----------
const str = (v) => (v == null ? "" : String(v));
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(v));
function requireEmail(v, field = "email") {
  if (!isEmail(v)) fail(422, `Invalid ${field}`);
  return str(v).trim().toLowerCase();
}
const num = (v, d = 0) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? d : Number(v));
const int = (v, d = 0) => Math.trunc(num(v, d));
const bool = (v, d = false) => (v === undefined || v === null ? d : !!v);
const strList = (v) => (Array.isArray(v) ? v.map(str) : []);

function planFields(b) {
  if (!str(b.name)) fail(422, "name is required");
  return {
    name: str(b.name),
    account_size: int(b.account_size),
    challenge_fee: num(b.challenge_fee),
    original_price: b.original_price === null || b.original_price === undefined || b.original_price === "" ? null : num(b.original_price),
    profit_target_points: int(b.profit_target_points, 750),
    profit_share: int(b.profit_share, 70),
    max_loss_limit: int(b.max_loss_limit, 20),
    min_trading_days: int(b.min_trading_days, 10),
    total_trading_days: int(b.total_trading_days, 15),
    trades_per_day: int(b.trades_per_day, 3),
    description: str(b.description),
    features: strList(b.features),
    popular: bool(b.popular),
    order: int(b.order),
  };
}
function blogFields(b) {
  if (!str(b.slug) || !str(b.title)) fail(422, "slug and title are required");
  return {
    slug: str(b.slug),
    title: str(b.title),
    excerpt: str(b.excerpt),
    content: str(b.content),
    cover_image: str(b.cover_image),
    author: str(b.author) || "IndiFunded Team",
    published: bool(b.published, true),
  };
}
function certFields(b) {
  if (!str(b.image_url)) fail(422, "image_url is required");
  return {
    image_url: str(b.image_url),
    trader_name: str(b.trader_name),
    amount: num(b.amount),
    plan: str(b.plan),
    account_size: int(b.account_size),
    payout_date: str(b.payout_date),
    order: int(b.order),
    visible: bool(b.visible, true),
    ...(b.trader_email ? { trader_email: str(b.trader_email).toLowerCase() } : {}),
  };
}
function couponFields(b) {
  const dp = num(b.discount_percent);
  if (dp < 0 || dp > 90) fail(422, "discount_percent must be between 0 and 90");
  return {
    code: str(b.code).trim().toUpperCase(),
    discount_percent: dp,
    active: bool(b.active, true),
    max_uses: b.max_uses === null || b.max_uses === undefined || b.max_uses === "" ? null : int(b.max_uses),
    expires_at: b.expires_at ? str(b.expires_at) : null,
    description: str(b.description),
  };
}
function leaderboardFields(b) {
  if (!str(b.name)) fail(422, "name is required");
  return {
    name: str(b.name),
    plan: str(b.plan) || "Standard",
    total_payout: num(b.total_payout),
    city: str(b.city),
    avatar_url: str(b.avatar_url),
    verified: bool(b.verified, true),
    rank_note: str(b.rank_note),
  };
}

export function couponUsable(c) {
  if (!c || c.active === false) return false;
  if (c.max_uses !== null && c.max_uses !== undefined && (c.used_count || 0) >= c.max_uses) return false;
  if (c.expires_at) {
    const exp = new Date(c.expires_at);
    if (!isNaN(exp.getTime()) && exp < new Date()) return false;
  }
  return true;
}

// ---------- main ----------
export async function handleApi(request, splat) {
  try {
    return await route(request, "/" + (splat || "").replace(/^\/+|\/+$/g, ""));
  } catch (e) {
    if (e instanceof HttpError) return json({ detail: e.detail }, e.status);
    console.error("API error", e);
    return json({ detail: "Internal server error" }, 500);
  }
}

async function route(request, path) {
  const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
  const db = store(sb);
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const seg = path.split("/").filter(Boolean);
  const is = (m, pattern) => {
    if (m !== method) return null;
    const p = pattern.split("/").filter(Boolean);
    if (p.length !== seg.length) return null;
    const params = {};
    for (let i = 0; i < p.length; i++) {
      if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(seg[i]);
      else if (p[i] !== seg[i]) return null;
    }
    return params;
  };
  let rawBody = null;
  const body = async () => {
    if (rawBody === null) rawBody = await request.text();
    if (!rawBody) return {};
    try {
      return JSON.parse(rawBody);
    } catch {
      fail(400, "Invalid JSON");
    }
  };

  // ----- auth helpers -----
  let cachedUser;
  const currentUser = async () => {
    if (cachedUser !== undefined) return cachedUser;
    const h = request.headers.get("authorization") || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!token) fail(401, "Not authenticated");
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data.user) fail(401, "Invalid token");
    const au = data.user;
    const { data: roles } = await sb.from("user_roles").select("role").eq("user_id", au.id);
    const role = roles && roles.some((r) => r.role === "admin") ? "admin" : "user";
    let profile = await db.get("users", au.id);
    if (!profile) {
      const name = str(au.user_metadata?.name) || str(au.email).split("@")[0];
      const first = (name.split(" ")[0] || "TRADER").toUpperCase();
      profile = {
        id: au.id,
        email: str(au.email).toLowerCase(),
        name,
        phone: str(au.user_metadata?.phone),
        apk_username: str(au.email).toLowerCase(),
        apk_password: `${first}@1234`,
        kyc: {},
        created_at: au.created_at || now(),
      };
      await db.put("users", profile);
    }
    cachedUser = { ...profile, role };
    return cachedUser;
  };
  const currentAdmin = async () => {
    const u = await currentUser();
    if (u.role !== "admin") fail(401, "Not authorized");
    return u;
  };

  let p;

  // ===== Root =====
  if (is("GET", "/")) return json({ message: "IndiFunded API" });

  // ===== Auth =====
  if (is("POST", "/auth/signup")) {
    const b = await body();
    const email = str(b.email).trim().toLowerCase();
    const password = str(b.password);
    const name = str(b.name).trim();
    const phone = str(b.phone).trim();
    if (!email || !email.includes("@")) fail(400, "Valid email is required");
    if (password.length < 6) fail(400, "Password must be at least 6 characters");
    if (!name) fail(400, "Name is required");
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone },
    });
    if (error) {
      if (/already|registered|exists/i.test(error.message)) fail(409, "An account with this email already exists");
      fail(400, error.message);
    }
    const first = (name.split(" ")[0] || "TRADER").toUpperCase();
    const doc = {
      id: data.user.id,
      email,
      name,
      phone,
      apk_username: email,
      apk_password: `${first}@1234`,
      kyc: {},
      created_at: now(),
    };
    await db.put("users", doc);
    return json({ ...doc, role: "user" });
  }
  if (is("POST", "/auth/logout")) return json({ ok: true });
  if (is("GET", "/auth/me")) return json(await currentUser());

  // ===== User dashboard =====
  const myOrders = async (email) => (await db.all("orders")).filter((o) => str(o.customer_email).toLowerCase() === email).sort(byDesc("created_at"));
  const myPayouts = async (email) => (await db.all("payout_requests")).filter((o) => str(o.email).toLowerCase() === email).sort(byDesc("created_at"));

  if (is("GET", "/me/dashboard")) {
    const user = await currentUser();
    const email = user.email.toLowerCase();
    const orders = await myOrders(email);
    const payouts = await myPayouts(email);
    const completed = orders.filter((o) => o.status === "completed");
    let capital = completed.reduce((s, o) => s + int(o.plan_account_size), 0);
    if (!capital && completed.length) {
      const plans = Object.fromEntries((await db.all("plans")).map((pl) => [pl.name, pl]));
      for (const o of completed) if (plans[o.plan_name]) capital += int(plans[o.plan_name].account_size);
    }
    const paid = payouts.filter((x) => x.status === "paid");
    return json({
      user: { id: user.id, email: user.email, name: user.name || "", phone: user.phone || "", created_at: user.created_at || "" },
      simulated_capital: capital,
      funded_accounts_active: completed.length,
      funded_accounts_total: orders.length,
      net_pnl: 0,
      total_paid_out: paid.reduce((s, x) => s + num(x.amount), 0),
      payouts_count: paid.length,
      accounts: completed.slice(0, 6),
    });
  }
  if (is("GET", "/me/accounts")) {
    const user = await currentUser();
    return json(await myOrders(user.email.toLowerCase()));
  }
  if (is("GET", "/me/payouts")) {
    const user = await currentUser();
    const payouts = await myPayouts(user.email.toLowerCase());
    return json({
      eligible: 0,
      pending_amount: payouts.filter((x) => ["pending", "approved"].includes(x.status)).reduce((s, x) => s + num(x.amount), 0),
      total_paid: payouts.filter((x) => x.status === "paid").reduce((s, x) => s + num(x.amount), 0),
      history: payouts,
    });
  }
  if (is("GET", "/me/certificates")) {
    const user = await currentUser();
    const email = user.email.toLowerCase();
    return json((await db.all("certificates")).filter((c) => str(c.trader_email).toLowerCase() === email && c.visible));
  }
  if (is("GET", "/me/billing")) {
    const user = await currentUser();
    const email = user.email.toLowerCase();
    const orders = await myOrders(email);
    const league = (await db.all("league_registrations")).filter((r) => str(r.email).toLowerCase() === email);
    const items = [
      ...orders.map((o) => ({ id: o.id, kind: "challenge", product: o.plan_name || "Challenge", amount: o.amount || 0, status: o.status || "pending_payment", created_at: o.created_at || "" })),
      ...league.map((r) => ({ id: r.id, kind: "league", product: "Trader League" + (r.is_existing_trader ? " (existing)" : " (new)"), amount: r.amount || 0, status: r.status || "pending_payment", created_at: r.created_at || "" })),
    ].sort(byDesc("created_at"));
    return json(items);
  }
  if (is("PUT", "/me/profile")) {
    const user = await currentUser();
    const b = await body();
    const updates = {};
    if (typeof b.name === "string" && b.name.trim()) updates.name = b.name.trim();
    if (typeof b.phone === "string") updates.phone = b.phone.trim();
    if (!Object.keys(updates).length) fail(400, "Nothing to update");
    const { role, ...profile } = user;
    const next = { ...profile, ...updates };
    await db.put("users", next);
    return json({ ...next, role });
  }
  if (is("PUT", "/me/kyc")) {
    const user = await currentUser();
    const b = await body();
    const kyc = {
      full_name: str(b.full_name).trim(),
      pan: str(b.pan).trim().toUpperCase(),
      upi_id: str(b.upi_id).trim(),
      bank_account_number: str(b.bank_account_number).trim(),
      ifsc: str(b.ifsc).trim().toUpperCase(),
      submitted_at: now(),
      status: "submitted",
    };
    if (!kyc.full_name || !kyc.pan) fail(400, "Full name and PAN are required");
    const { role, ...profile } = user;
    await db.put("users", { ...profile, kyc });
    return json(kyc);
  }

  // ===== Admin users =====
  if (is("GET", "/admin/users")) {
    await currentAdmin();
    const { data: admins } = await sb.from("user_roles").select("user_id").eq("role", "admin");
    const adminIds = new Set((admins || []).map((a) => a.user_id));
    return json((await db.all("users")).filter((u) => !adminIds.has(u.id)).sort(byDesc("created_at")));
  }
  if ((p = is("DELETE", "/admin/users/:id"))) {
    await currentAdmin();
    const { data: isAdm } = await sb.from("user_roles").select("id").eq("user_id", p.id).eq("role", "admin");
    if (!isAdm || !isAdm.length) {
      await sb.auth.admin.deleteUser(p.id).catch(() => null);
      await db.del("users", p.id);
    }
    return json({ ok: true });
  }

  // ===== Generic admin CRUD collections =====
  // Plans
  if (is("GET", "/plans")) return json((await db.all("plans")).sort(byNum("order")));
  if ((p = is("GET", "/plans/:id"))) {
    const pl = await db.get("plans", p.id);
    if (!pl) fail(404, "Plan not found");
    return json(pl);
  }
  if (is("POST", "/plans")) {
    await currentAdmin();
    return json(await db.put("plans", { id: uuid(), ...planFields(await body()), created_at: now() }));
  }
  if ((p = is("PUT", "/plans/:id"))) {
    await currentAdmin();
    const old = await db.get("plans", p.id);
    if (!old) fail(404, "Plan not found");
    return json(await db.put("plans", { ...old, ...planFields(await body()) }));
  }
  if ((p = is("DELETE", "/plans/:id"))) {
    await currentAdmin();
    await db.del("plans", p.id);
    return json({ ok: true });
  }

  // Blogs
  if (is("GET", "/blogs")) return json((await db.all("blogs")).filter((b) => b.published).sort(byDesc("created_at")));
  if (is("GET", "/blogs/all")) {
    await currentAdmin();
    return json((await db.all("blogs")).sort(byDesc("created_at")));
  }
  if ((p = is("GET", "/blogs/:slug"))) {
    const b = await db.findOne("blogs", (x) => x.slug === p.slug);
    if (!b) fail(404, "Blog not found");
    return json(b);
  }
  if (is("POST", "/blogs")) {
    await currentAdmin();
    const f = blogFields(await body());
    if (await db.findOne("blogs", (x) => x.slug === f.slug)) fail(400, "Slug already exists");
    return json(await db.put("blogs", { id: uuid(), ...f, created_at: now() }));
  }
  if ((p = is("PUT", "/blogs/:id"))) {
    await currentAdmin();
    const old = await db.get("blogs", p.id);
    if (!old) fail(404, "Blog not found");
    return json(await db.put("blogs", { ...old, ...blogFields(await body()) }));
  }
  if ((p = is("DELETE", "/blogs/:id"))) {
    await currentAdmin();
    await db.del("blogs", p.id);
    return json({ ok: true });
  }

  // Leads
  if (is("POST", "/leads")) {
    const b = await body();
    if (!str(b.first_name)) fail(422, "first_name is required");
    const lead = {
      id: uuid(),
      first_name: str(b.first_name).slice(0, 200),
      last_name: str(b.last_name).slice(0, 200),
      email: requireEmail(b.email),
      phone: str(b.phone).slice(0, 50),
      city: str(b.city).slice(0, 200),
      challenge_type: str(b.challenge_type).slice(0, 200),
      platform: str(b.platform).slice(0, 200),
      message: str(b.message).slice(0, 5000),
      created_at: now(),
    };
    return json(await db.put("leads", lead));
  }
  if (is("GET", "/leads")) {
    await currentAdmin();
    return json((await db.all("leads")).sort(byDesc("created_at")));
  }
  if ((p = is("DELETE", "/leads/:id"))) {
    await currentAdmin();
    await db.del("leads", p.id);
    return json({ ok: true });
  }

  // Certificates
  if (is("GET", "/certificates")) return json((await db.all("certificates")).filter((c) => c.visible).sort(byNum("order")));
  if (is("GET", "/certificates/all")) {
    await currentAdmin();
    return json((await db.all("certificates")).sort(byNum("order")));
  }
  if (is("POST", "/certificates")) {
    await currentAdmin();
    return json(await db.put("certificates", { id: uuid(), ...certFields(await body()), created_at: now() }));
  }
  if ((p = is("PUT", "/certificates/:id"))) {
    await currentAdmin();
    const old = await db.get("certificates", p.id);
    if (!old) fail(404, "Certificate not found");
    return json(await db.put("certificates", { ...old, ...certFields(await body()) }));
  }
  if ((p = is("DELETE", "/certificates/:id"))) {
    await currentAdmin();
    await db.del("certificates", p.id);
    return json({ ok: true });
  }

  // Payout requests
  if (is("POST", "/payout-requests")) {
    const b = await body();
    const amount = num(b.amount);
    const methodName = str(b.method) || "upi";
    if (!str(b.full_name) || !str(b.phone)) fail(422, "Name and phone are required");
    if (amount <= 0) fail(400, "Amount must be greater than 0");
    if (!["upi", "bank"].includes(methodName)) fail(400, "Invalid payout method");
    if (methodName === "upi" && !str(b.upi_id).trim()) fail(400, "UPI ID is required for UPI payouts");
    if (methodName === "bank" && !(str(b.account_number).trim() && str(b.ifsc).trim()))
      fail(400, "Bank account number and IFSC are required for bank payouts");
    const req = {
      id: uuid(),
      full_name: str(b.full_name),
      email: requireEmail(b.email),
      phone: str(b.phone),
      account_id: str(b.account_id),
      plan: str(b.plan),
      amount,
      method: methodName,
      upi_id: str(b.upi_id),
      bank_name: str(b.bank_name),
      account_number: str(b.account_number),
      ifsc: str(b.ifsc),
      account_holder: str(b.account_holder),
      notes: str(b.notes),
      status: "pending",
      admin_note: "",
      created_at: now(),
    };
    return json(await db.put("payout_requests", req));
  }
  if (is("GET", "/payout-requests")) {
    await currentAdmin();
    return json((await db.all("payout_requests")).sort(byDesc("created_at")));
  }
  if ((p = is("PATCH", "/payout-requests/:id"))) {
    await currentAdmin();
    const b = await body();
    const old = await db.get("payout_requests", p.id);
    if (!old) fail(404, "Payout request not found");
    const upd = {};
    if (b.status != null) {
      if (!["pending", "approved", "paid", "rejected"].includes(b.status)) fail(400, "Invalid status");
      upd.status = b.status;
    }
    if (b.admin_note != null) upd.admin_note = str(b.admin_note);
    return json(await db.put("payout_requests", { ...old, ...upd }));
  }
  if ((p = is("DELETE", "/payout-requests/:id"))) {
    await currentAdmin();
    await db.del("payout_requests", p.id);
    return json({ ok: true });
  }

  // Uploads (data URL pass-through, as in the original)
  if (is("POST", "/uploads/image")) {
    await currentAdmin();
    const b = await body();
    const d = str(b.data_url);
    if (!d.startsWith("data:image/")) fail(400, "Not a valid image data URL");
    if (d.length > 8 * 1024 * 1024) fail(413, "Image too large (max ~6MB)");
    return json({ url: d });
  }

  // Settings
  if (is("GET", "/settings")) {
    const doc = await db.get("settings", "site");
    return json(doc ? mergeSettings(DEFAULT_SETTINGS, doc) : DEFAULT_SETTINGS);
  }
  if (is("PUT", "/settings")) {
    await currentAdmin();
    const b = await body();
    delete b._id;
    const old = (await db.get("settings", "site")) || {};
    const next = { ...old, ...b, id: "site" };
    await db.put("settings", next);
    return json(mergeSettings(DEFAULT_SETTINGS, next));
  }
  if (is("DELETE", "/settings")) {
    await currentAdmin();
    await db.delAll("settings");
    return json({ ok: true });
  }

  // ===== Orders / pricing =====
  const computePricing = async (plan, couponCode, referralCode) => {
    const base = num(plan.challenge_fee);
    let final = base;
    let discount = 0;
    let ccode = null;
    if (couponCode) {
      const up = str(couponCode).trim().toUpperCase();
      const c = await db.findOne("coupons", (x) => x.code === up);
      if (couponUsable(c)) {
        discount = Math.round(base * num(c.discount_percent)) / 100;
        final = Math.max(0, Math.round((base - discount) * 100) / 100);
        ccode = up;
        await db.put("coupons", { ...c, used_count: (c.used_count || 0) + 1 });
      }
    }
    let rcode = null;
    if (referralCode) {
      const rc = str(referralCode).trim().toUpperCase();
      const r = await db.findOne("referrals", (x) => x.code === rc);
      if (r) {
        rcode = rc;
        await db.put("referrals", { ...r, referrals_count: (r.referrals_count || 0) + 1, earnings: (r.earnings || 0) + Math.trunc(final * 0.05) });
      }
    }
    return { base, final, discount, ccode, rcode };
  };
  const orderCustomer = (b) => {
    if (!str(b.customer_name) || !str(b.customer_phone)) fail(422, "Name and phone are required");
    return {
      customer_name: str(b.customer_name),
      customer_email: requireEmail(b.customer_email, "customer_email"),
      customer_phone: str(b.customer_phone),
      notes: str(b.notes),
    };
  };

  if (is("POST", "/orders/upi")) {
    const b = await body();
    const cust = orderCustomer(b);
    if (!str(b.utr).trim()) fail(422, "UTR is required");
    const plan = await db.get("plans", str(b.plan_id));
    if (!plan) fail(404, "Plan not found");
    const pr = await computePricing(plan, b.coupon_code, b.referral_code);
    const order = {
      id: uuid(),
      plan_id: plan.id,
      plan_name: plan.name,
      plan_account_size: plan.account_size,
      amount: pr.final,
      base_amount: pr.base,
      discount_amount: pr.discount,
      coupon_code: pr.ccode,
      referral_code: pr.rcode,
      currency: "inr",
      payment_method: "upi",
      upi_id: "indifunded@upi",
      utr: str(b.utr).trim(),
      ...cust,
      status: "pending_verification",
      created_at: now(),
    };
    return json(await db.put("orders", order));
  }

  if (is("POST", "/orders/razorpay/create")) {
    requireRazorpay();
    const b = await body();
    const cust = orderCustomer(b);
    const plan = await db.get("plans", str(b.plan_id));
    if (!plan) fail(404, "Plan not found");
    const pr = await computePricing(plan, b.coupon_code, b.referral_code);
    const paise = Math.round(pr.final * 100);
    if (paise < 100) fail(400, "Amount too low for online payment");
    const orderId = uuid();
    const resp = await rz("POST", "/payments/qr_codes", {
      type: "upi_qr",
      name: `IndiFunded - ${plan.name}`.slice(0, 50),
      usage: "single_use",
      fixed_amount: true,
      payment_amount: paise,
      description: `IndiFunded ${plan.name} Challenge`.slice(0, 100),
      notes: { order_id: orderId, plan: plan.name, email: cust.customer_email },
    });
    if (![200, 201].includes(resp.status)) fail(502, `Razorpay error: ${(await resp.text()).slice(0, 300)}`);
    const qr = await resp.json();
    await db.put("orders", {
      id: orderId,
      plan_id: plan.id,
      plan_name: plan.name,
      plan_account_size: plan.account_size,
      amount: pr.final,
      base_amount: pr.base,
      discount_amount: pr.discount,
      coupon_code: pr.ccode,
      referral_code: pr.rcode,
      currency: "inr",
      payment_method: "razorpay_qr",
      razorpay_qr_id: qr.id,
      razorpay_qr_image: qr.image_url,
      razorpay_payment_id: null,
      ...cust,
      status: "pending_payment",
      created_at: now(),
    });
    return json({ order_id: orderId, qr_image: qr.image_url, qr_id: qr.id, amount: pr.final });
  }

  if ((p = is("GET", "/orders/razorpay/status/:id"))) {
    const order = await db.get("orders", p.id);
    if (!order) fail(404, "Order not found");
    if (order.status === "completed") return json({ status: "completed", paid: true });
    if (!order.razorpay_qr_id || !env("RAZORPAY_KEY_ID")) return json({ status: order.status, paid: false });
    const resp = await rz("GET", `/payments/qr_codes/${order.razorpay_qr_id}/payments`).catch(() => null);
    if (!resp || resp.status !== 200) return json({ status: order.status, paid: false });
    const items = (await resp.json()).items || [];
    const captured = items.find((x) => x.status === "captured");
    if (captured) {
      await db.put("orders", { ...order, status: "completed", razorpay_payment_id: captured.id });
      await rz("POST", `/payments/qr_codes/${order.razorpay_qr_id}/close`).catch(() => null);
      return json({ status: "completed", paid: true });
    }
    return json({ status: order.status, paid: false });
  }

  if (is("POST", "/orders/razorpay/checkout-order")) {
    requireRazorpay();
    const b = await body();
    const cust = orderCustomer(b);
    const plan = await db.get("plans", str(b.plan_id));
    if (!plan) fail(404, "Plan not found");
    const pr = await computePricing(plan, b.coupon_code, b.referral_code);
    const paise = Math.round(pr.final * 100);
    if (paise < 100) fail(400, "Amount too low for online payment");
    const orderId = uuid();
    const resp = await rz("POST", "/orders", {
      amount: paise,
      currency: "INR",
      receipt: orderId.slice(0, 40),
      notes: { order_id: orderId, plan: plan.name, kind: "challenge", email: cust.customer_email },
    });
    if (![200, 201].includes(resp.status)) fail(502, `Razorpay error: ${(await resp.text()).slice(0, 300)}`);
    const rzo = await resp.json();
    await db.put("orders", {
      id: orderId,
      plan_id: plan.id,
      plan_name: plan.name,
      plan_account_size: plan.account_size,
      amount: pr.final,
      base_amount: pr.base,
      discount_amount: pr.discount,
      coupon_code: pr.ccode,
      referral_code: pr.rcode,
      currency: "inr",
      payment_method: "razorpay_checkout",
      razorpay_order_id: rzo.id,
      razorpay_payment_id: null,
      ...cust,
      status: "pending_payment",
      created_at: now(),
    });
    return json({
      order_id: orderId,
      razorpay_order_id: rzo.id,
      amount: pr.final,
      amount_paise: paise,
      key_id: env("RAZORPAY_KEY_ID"),
      customer: { name: cust.customer_name, email: cust.customer_email, phone: cust.customer_phone },
      description: `IndiFunded ${plan.name} Challenge`,
    });
  }

  if (is("POST", "/orders/razorpay/verify")) {
    const b = await body();
    const oid = str(b.razorpay_order_id);
    const pid = str(b.razorpay_payment_id);
    const sig = str(b.razorpay_signature);
    if (!(oid && pid && sig)) fail(400, "Missing payment fields");
    const secret = env("RAZORPAY_KEY_SECRET");
    if (!secret) fail(500, "Razorpay is not configured");
    if (!safeEqual(await hmacHex(secret, `${oid}|${pid}`), sig)) fail(400, "Invalid Razorpay signature");
    const order = await db.findOne("orders", (x) => x.razorpay_order_id === oid);
    if (order) {
      await db.put("orders", { ...order, status: "completed", razorpay_payment_id: pid });
      return json({ status: "completed", kind: "order", id: order.id });
    }
    const reg = await db.findOne("league_registrations", (x) => x.razorpay_order_id === oid);
    if (reg) {
      await db.put("league_registrations", { ...reg, status: "completed", razorpay_payment_id: pid });
      return json({ status: "completed", kind: "league", id: reg.id });
    }
    fail(404, "Order not found");
  }

  if (is("POST", "/webhooks/razorpay")) {
    const raw = await request.text();
    const secret = env("RAZORPAY_WEBHOOK_SECRET");
    if (!secret) fail(400, "Webhook secret not configured");
    const sig = request.headers.get("x-razorpay-signature") || "";
    if (!safeEqual(await hmacHex(secret, raw), sig)) fail(400, "Invalid signature");
    let evt;
    try {
      evt = JSON.parse(raw);
    } catch {
      fail(400, "Invalid payload");
    }
    const pay = evt?.payload?.payment?.entity || {};
    const qrE = evt?.payload?.qr_code?.entity || {};
    const qrId = qrE.id || pay.qr_code_id;
    let order = null;
    if (qrId) order = await db.findOne("orders", (x) => x.razorpay_qr_id === qrId);
    if (!order && pay.notes?.order_id) order = await db.get("orders", str(pay.notes.order_id));
    if (order && order.status !== "completed" && pay.status === "captured") {
      await db.put("orders", { ...order, status: "completed", razorpay_payment_id: pay.id });
    }
    return json({ status: "ok" });
  }

  if ((p = is("PATCH", "/orders/:id/status"))) {
    await currentAdmin();
    const status = url.searchParams.get("status") || str((await body()).status);
    if (!["pending_verification", "completed", "rejected"].includes(status)) fail(400, "Invalid status");
    const o = await db.get("orders", p.id);
    if (!o) fail(404, "Order not found");
    return json(await db.put("orders", { ...o, status }));
  }
  if ((p = is("DELETE", "/orders/:id"))) {
    await currentAdmin();
    await db.del("orders", p.id);
    return json({ ok: true });
  }
  if (is("GET", "/orders")) {
    await currentAdmin();
    return json((await db.all("orders")).sort(byDesc("created_at")));
  }
  if (is("GET", "/admin/stats")) {
    await currentAdmin();
    const [plans, blogs, leads, orders, payouts] = await Promise.all(["plans", "blogs", "leads", "orders", "payout_requests"].map((c) => db.all(c)));
    return json({
      plans: plans.length,
      blogs: blogs.length,
      leads: leads.length,
      orders: orders.length,
      pending_orders: orders.filter((o) => o.status === "pending_verification").length,
      revenue: orders.filter((o) => o.status === "completed").reduce((s, o) => s + num(o.amount), 0),
      payout_requests: payouts.length,
      pending_payouts: payouts.filter((x) => x.status === "pending").length,
    });
  }

  // Stripe endpoints from the original are not used by the site's pages.
  if (is("POST", "/checkout/session") || is("POST", "/webhook/stripe") || (seg[0] === "checkout" && seg[1] === "status")) {
    fail(410, "Card checkout is not available. Please pay via UPI.");
  }

  // ===== Weekly highest payouts =====
  if (is("GET", "/weekly-highest-payouts")) {
    const curated = (await db.all("weekly_payouts")).filter((x) => x.visible).sort((a, b) => num(a.order) - num(b.order) || num(b.amount) - num(a.amount));
    if (curated.length) {
      const seen = new Map();
      for (const r of curated) if (!seen.has(r.plan || "")) seen.set(r.plan || "", r);
      return json([...seen.values()]);
    }
    const certs = (await db.all("certificates")).filter((c) => c.visible);
    const since = new Date(Date.now() - 7 * 864e5).toISOString();
    const group = (rows) => {
      const m = new Map();
      for (const c of [...rows].sort(byNum("amount", -1))) {
        if (!m.has(c.plan)) m.set(c.plan, { trader_name: c.trader_name, amount: c.amount, plan: c.plan, account_size: c.account_size, payout_date: c.payout_date, image_url: c.image_url });
      }
      return [...m.values()].sort(byNum("amount", -1));
    };
    let rows = group(certs.filter((c) => str(c.created_at) >= since));
    if (!rows.length) rows = group(certs);
    return json(rows);
  }
  const wpFields = certFields;
  if (is("GET", "/admin/weekly-payouts")) {
    await currentAdmin();
    return json((await db.all("weekly_payouts")).sort((a, b) => num(a.order) - num(b.order) || str(b.created_at).localeCompare(str(a.created_at))));
  }
  if (is("POST", "/admin/weekly-payouts")) {
    await currentAdmin();
    return json(await db.put("weekly_payouts", { id: uuid(), ...wpFields(await body()), created_at: now() }));
  }
  if ((p = is("PUT", "/admin/weekly-payouts/:id"))) {
    await currentAdmin();
    const old = await db.get("weekly_payouts", p.id);
    if (!old) return json(null);
    return json(await db.put("weekly_payouts", { ...old, ...wpFields(await body()) }));
  }
  if ((p = is("DELETE", "/admin/weekly-payouts/:id"))) {
    await currentAdmin();
    await db.del("weekly_payouts", p.id);
    return json({ ok: true });
  }

  // ===== Trader League =====
  const leagueEnabled = async () => !!(await db.get("system_meta", "league_enabled"))?.value;
  if (is("GET", "/league/config")) return json({ enabled: await leagueEnabled(), fee_existing: LEAGUE_FEE_EXISTING, fee_new: LEAGUE_FEE_NEW });
  if (is("PUT", "/league/config")) {
    await currentAdmin();
    const enabled = !!(await body()).enabled;
    await db.put("system_meta", { id: "league_enabled", key: "league_enabled", value: enabled, updated_at: now() });
    return json({ enabled });
  }
  if (is("POST", "/league/register")) {
    if (!(await leagueEnabled())) fail(403, "Trader League registration is currently closed");
    requireRazorpay();
    const b = await body();
    const existing = !!b.is_existing_trader;
    if (!str(b.full_name) || !str(b.phone)) fail(422, "Name and phone are required");
    const email = requireEmail(b.email);
    if (existing && !str(b.trader_id).trim()) fail(400, "Trader ID is required for existing traders");
    const amount = existing ? LEAGUE_FEE_EXISTING : LEAGUE_FEE_NEW;
    const reg = {
      id: uuid(),
      full_name: str(b.full_name),
      email,
      phone: str(b.phone),
      is_existing_trader: existing,
      trader_id: str(b.trader_id),
      notes: str(b.notes),
      amount,
      status: "pending_payment",
      razorpay_qr_id: "",
      razorpay_qr_image: "",
      razorpay_order_id: "",
      razorpay_payment_id: "",
      created_at: now(),
    };
    const paise = Math.round(amount * 100);
    const resp = await rz("POST", "/orders", { amount: paise, currency: "INR", receipt: reg.id.slice(0, 40), notes: { reg_id: reg.id, email, kind: "league" } });
    if (![200, 201].includes(resp.status)) fail(502, `Razorpay error: ${(await resp.text()).slice(0, 300)}`);
    reg.razorpay_order_id = (await resp.json()).id || "";
    await db.put("league_registrations", reg);
    return json({
      registration_id: reg.id,
      razorpay_order_id: reg.razorpay_order_id,
      amount,
      amount_paise: paise,
      key_id: env("RAZORPAY_KEY_ID"),
      customer: { name: reg.full_name, email, phone: reg.phone },
      description: "IndiFunded Trader League Registration",
    });
  }
  if ((p = is("GET", "/league/status/:id"))) {
    const reg = await db.get("league_registrations", p.id);
    if (!reg) fail(404, "Registration not found");
    return json({ status: reg.status, amount: reg.amount });
  }
  if (is("GET", "/league/registrations")) {
    await currentAdmin();
    return json((await db.all("league_registrations")).sort(byDesc("created_at")));
  }
  if ((p = is("DELETE", "/league/registrations/:id"))) {
    await currentAdmin();
    await db.del("league_registrations", p.id);
    return json({ ok: true });
  }

  // ===== Certificate AI reader =====
  if (is("POST", "/admin/certificates/analyze")) {
    await currentAdmin();
    const b = await body();
    const d = str(b.data_url);
    if (!d.startsWith("data:image/")) fail(400, "Not a valid image data URL");
    const key = env("LOVABLE_API_KEY");
    if (!key) fail(500, "AI is not configured");
    const system =
      'You are a receipt/bank-transfer OCR assistant. You will be shown a screenshot of a UPI/bank payout receipt. Extract these fields and return ONLY valid JSON (no markdown fences, no commentary): {"name": "recipient full name", "amount": <number in INR without commas or currency symbol>, "date": "YYYY-MM-DD", "plan": "Starter | Standard | Pro (guess based on amount: <15000 Starter, 15000-30000 Standard, >30000 Pro)", "raw_text": "short summary of what the receipt shows"}. If a field is not visible, use null.';
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: [{ type: "text", text: "Extract the fields from this payout receipt." }, { type: "image_url", image_url: { url: d } }] },
        ],
      }),
    });
    if (resp.status === 429) fail(429, "AI is busy, please try again in a moment.");
    if (resp.status === 402) fail(402, "AI credits are used up. Add credits in workspace settings.");
    if (!resp.ok) fail(502, `AI analysis failed: ${(await resp.text()).slice(0, 200)}`);
    const text = str((await resp.json()).choices?.[0]?.message?.content).replace(/^```(?:json)?\s*|\s*```$/gm, "").trim();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) try { parsed = JSON.parse(m[0]); } catch { parsed = null; }
    }
    if (!parsed) return json({ name: null, amount: null, date: null, plan: null, raw_text: text.slice(0, 500) });
    return json({ name: parsed.name ?? null, amount: parsed.amount ?? null, date: parsed.date ?? null, plan: parsed.plan ?? null, raw_text: parsed.raw_text || "" });
  }

  // ===== Coupons =====
  if (is("GET", "/coupons")) {
    await currentAdmin();
    return json((await db.all("coupons")).sort(byDesc("created_at")));
  }
  if (is("POST", "/coupons")) {
    await currentAdmin();
    const f = couponFields(await body());
    if (!f.code) fail(400, "Code required");
    if (await db.findOne("coupons", (x) => x.code === f.code)) fail(400, "Coupon code already exists");
    return json(await db.put("coupons", { ...f, id: uuid(), used_count: 0, created_at: now() }));
  }
  if ((p = is("PUT", "/coupons/:id"))) {
    await currentAdmin();
    const old = await db.get("coupons", p.id);
    if (!old) fail(404, "Coupon not found");
    return json(await db.put("coupons", { ...old, ...couponFields(await body()) }));
  }
  if ((p = is("DELETE", "/coupons/:id"))) {
    await currentAdmin();
    await db.del("coupons", p.id);
    return json({ ok: true });
  }
  if (is("POST", "/coupons/validate")) {
    const b = await body();
    const code = str(b.code).trim().toUpperCase();
    const c = await db.findOne("coupons", (x) => x.code === code);
    if (!c || c.active === false) fail(404, "Invalid or inactive coupon");
    if (c.max_uses !== null && c.max_uses !== undefined && (c.used_count || 0) >= c.max_uses) fail(400, "Coupon usage limit reached");
    if (c.expires_at) {
      const exp = new Date(c.expires_at);
      if (!isNaN(exp.getTime()) && exp < new Date()) fail(400, "Coupon has expired");
    }
    const amount = num(b.amount);
    const discount = Math.round(amount * num(c.discount_percent)) / 100;
    return json({ code, discount_percent: c.discount_percent, discount_amount: discount, final_amount: Math.max(0, Math.round((amount - discount) * 100) / 100), description: c.description || "" });
  }

  // ===== Leaderboard =====
  if (is("GET", "/leaderboard")) {
    const limit = Math.min(int(url.searchParams.get("limit"), 20) || 20, 100);
    return json((await db.all("leaderboard")).sort(byNum("total_payout", -1)).slice(0, limit));
  }
  if (is("POST", "/leaderboard")) {
    await currentAdmin();
    return json(await db.put("leaderboard", { ...leaderboardFields(await body()), id: uuid(), created_at: now() }));
  }
  if ((p = is("PUT", "/leaderboard/:id"))) {
    await currentAdmin();
    const old = await db.get("leaderboard", p.id);
    if (!old) fail(404, "Entry not found");
    return json(await db.put("leaderboard", { ...old, ...leaderboardFields(await body()) }));
  }
  if ((p = is("DELETE", "/leaderboard/:id"))) {
    await currentAdmin();
    await db.del("leaderboard", p.id);
    return json({ ok: true });
  }

  // ===== Referrals =====
  if (is("POST", "/referrals")) {
    const b = await body();
    if (!str(b.name)) fail(422, "name is required");
    const email = requireEmail(b.email);
    const existing = await db.findOne("referrals", (x) => x.email === email);
    const publicView = (r) => ({ id: r.id, code: r.code, name: r.name, referrals_count: r.referrals_count || 0, earnings: r.earnings || 0, created_at: r.created_at });
    if (existing) return json(publicView(existing));
    const all = await db.all("referrals");
    const base = str(b.name).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "TRADE";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code = base + String(Math.floor(Math.random() * 10000)).padStart(4, "0");
      if (!all.some((x) => x.code === code)) break;
    }
    const doc = { id: uuid(), code, name: str(b.name), email, phone: str(b.phone), referrals_count: 0, earnings: 0, created_at: now() };
    await db.put("referrals", doc);
    return json(publicView(doc));
  }
  if ((p = is("GET", "/referrals/:code"))) {
    const code = p.code.trim().toUpperCase();
    const r = await db.findOne("referrals", (x) => x.code === code);
    if (!r) fail(404, "Referral code not found");
    return json({ code: r.code, name: r.name, referrals_count: r.referrals_count || 0 });
  }
  if (is("GET", "/admin/referrals")) {
    await currentAdmin();
    return json((await db.all("referrals")).sort(byDesc("created_at")));
  }
  if ((p = is("DELETE", "/admin/referrals/:id"))) {
    await currentAdmin();
    await db.del("referrals", p.id);
    return json({ ok: true });
  }

  fail(404, "Not Found");
}
