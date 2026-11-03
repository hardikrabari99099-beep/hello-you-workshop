import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { api } from "../lib/api";
import { useSettings } from "../context/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HowItWorksSection from "../components/HowItWorks";
import { ShieldCheck, Search, CheckCircle2, XCircle, ArrowRight, Building2, Users, Wallet, Award, Star } from "lucide-react";

const Shell = ({ chip, title, sub, children }) => (
  <div className="container-xl pt-12 md:pt-16 pb-16 md:pb-24">
    <div className="chip mb-4">{chip}</div>
    <h1 className="font-display text-3xl sm:text-4xl md:text-6xl max-w-3xl">{title}</h1>
    {sub && <p className="text-[var(--muted)] mt-4 md:mt-6 max-w-2xl text-sm md:text-base">{sub}</p>}
    <div className="mt-10">{children}</div>
  </div>
);

export function HowItWorksPage() {
  return (
    <Shell chip="How it works" title="From challenge to funded trader in four steps" sub="Buy a challenge, prove your skill, get funded and withdraw your profit share.">
      <HowItWorksSection />
      <div className="flex gap-3 mt-6">
        <Link to="/challenges" className="btn-amber rounded-full px-6 py-3 inline-flex items-center gap-2">See challenges <ArrowRight size={16}/></Link>
        <Link to="/rules" className="rounded-full px-6 py-3 border border-[var(--border-hi)]">Trading rules</Link>
      </div>
    </Shell>
  );
}

export function TrustCenter() {
  const { settings } = useSettings();
  const c = settings.contact || {}, b = settings.brand || {};
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/public/stats").then((r) => setStats(r.data)).catch(() => setStats({})); }, []);
  const cards = [
    { i: <Users/>, t: "Registered traders", v: stats?.traders },
    { i: <Wallet/>, t: "Verified payouts", v: stats?.payouts },
    { i: <Award/>, t: "Payout certificates", v: stats?.certificates },
  ];
  return (
    <Shell chip="Trust Center" title="Transparency you can check" sub="Company details and live platform numbers, taken straight from our records.">
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((x) => (
          <div key={x.t} className="glass-card p-6">
            <div className="text-[var(--accent)]">{x.i}</div>
            <div className="font-display text-4xl mt-4">{stats ? (x.v ?? 0) : "…"}</div>
            <div className="text-sm text-[var(--muted)] mt-1">{x.t}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 md:p-8 mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2 font-display text-xl mb-3"><Building2 size={18}/> Company</div>
        <div><span className="text-[var(--muted)]">Name:</span> {c.company || b.name}</div>
        <div><span className="text-[var(--muted)]">Address:</span> {c.address}</div>
        <div><span className="text-[var(--muted)]">Email:</span> {c.email}</div>
        <div><span className="text-[var(--muted)]">Phone:</span> {c.phone}</div>
      </div>
      <div className="flex flex-wrap gap-3 mt-6 text-sm">
        <Link to="/verify-payout" className="btn-amber rounded-full px-5 py-2.5 inline-flex items-center gap-2"><ShieldCheck size={16}/> Verify a payout</Link>
        <Link to="/payouts" className="rounded-full px-5 py-2.5 border border-[var(--border-hi)]">Payout records</Link>
      </div>
    </Shell>
  );
}

export function VerifyPayout() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const go = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try { const r = await api.get("/public/verify-payout", { params: { q: q.trim() } }); setRes(r.data); }
    catch { setRes(null); }
    finally { setBusy(false); }
  };
  return (
    <Shell chip="Verification" title="Verify a payout" sub="Enter a certificate ID or trader name to confirm a payout is genuine.">
      <form onSubmit={go} className="flex gap-2 max-w-xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Certificate ID or trader name" maxLength={100}
          className="flex-1 rounded-full bg-transparent border border-[var(--border-hi)] px-5 py-3 text-sm" />
        <button disabled={busy} className="btn-amber rounded-full px-5 py-3 inline-flex items-center gap-2"><Search size={16}/> Check</button>
      </form>
      {res === null && <div className="glass-card p-5 mt-6 flex gap-2 items-center max-w-xl"><XCircle className="text-red-400"/> No verified payout found.</div>}
      {res && res.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {res.map((c) => (
            <div key={c.id} className="glass-card p-5">
              <div className="flex items-center gap-2 text-[var(--emerald)] text-sm"><CheckCircle2 size={16}/> Verified</div>
              <div className="font-display text-xl mt-2">{c.trader_name}</div>
              <div className="text-sm text-[var(--muted)]">{c.amount ? `₹${c.amount}` : ""} {c.date ? `· ${c.date}` : ""}</div>
              <div className="text-xs text-[var(--muted-2)] mt-2 break-all">ID: {c.id}</div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

const POLICIES = {
  privacy: { title: "Privacy Policy", body: [
    ["What we collect", "Your name, email, phone, payment references and trading account activity, so we can run your challenge and pay you."],
    ["How we use it", "To create accounts, verify payments and payouts, prevent fraud and contact you about your account. We never sell your data."],
    ["Storage and security", "Data is stored on secure servers with restricted access. Payment card details are handled by our payment partner, not by us."],
    ["Your rights", "You can ask us to view, correct or delete your data by writing to our support email."],
  ]},
  terms: { title: "Terms and Conditions", body: [
    ["Eligibility", "You must be 18 or older and give accurate details to buy a challenge."],
    ["Simulated evaluation", "Challenges are evaluations. Passing them qualifies you for a funded account under a profit-share agreement."],
    ["Rules", "Breaking daily loss, overall loss or other published rules ends the challenge. Abuse, copy trading and exploits lead to disqualification."],
    ["Payouts", "Profit shares are paid after verification and KYC, under the payout schedule shown on the site."],
  ]},
  refund: { title: "Refund Policy", body: [
    ["Challenge fees", "Fees are non-refundable once the trading account has been issued."],
    ["Before activation", "If your account has not been issued yet, contact support within 24 hours of payment for a refund review."],
    ["Duplicate payments", "Duplicate or failed-but-charged payments are refunded to the original method after verification."],
  ]},
  risk: { title: "Risk Disclosure", body: [
    ["Trading risk", "Trading in financial markets carries a high level of risk and may not suit everyone. Past results do not guarantee future results."],
    ["No investment advice", "Nothing on this site is financial advice. Tools and content are for education only."],
    ["Your responsibility", "Only trade with money you can afford to lose, and make your own decisions."],
  ]},
};

export function PolicyPage({ kind }) {
  const p = POLICIES[kind];
  return (
    <Shell chip="Legal" title={p.title}>
      <div className="max-w-3xl space-y-6">
        {p.body.map(([h, t]) => (
          <div key={h}><h2 className="font-display text-xl">{h}</h2><p className="text-[var(--muted)] mt-2 leading-relaxed">{t}</p></div>
        ))}
      </div>
    </Shell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    if (error) return toast.error(error.message);
    setSent(true);
  };
  return (
    <Shell chip="Account" title="Forgot password" sub="We'll email you a link to choose a new password.">
      {sent ? <div className="glass-card p-5 max-w-md">Check your inbox for the reset link.</div> : (
        <form onSubmit={submit} className="glass-card p-6 max-w-md space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            className="w-full rounded-lg bg-transparent border border-[var(--border-hi)] px-4 py-3 text-sm" />
          <button className="btn-amber rounded-full px-6 py-3 w-full">Send reset link</button>
          <Link to="/login" className="block text-center text-sm text-[var(--muted)]">Back to sign in</Link>
        </form>
      )}
    </Shell>
  );
}

export function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Use at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    nav("/app");
  };
  return (
    <Shell chip="Account" title="Choose a new password">
      <form onSubmit={submit} className="glass-card p-6 max-w-md space-y-4">
        <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password"
          className="w-full rounded-lg bg-transparent border border-[var(--border-hi)] px-4 py-3 text-sm" />
        <button className="btn-amber rounded-full px-6 py-3 w-full">Update password</button>
      </form>
    </Shell>
  );
}

const ytEmbed = (u) => {
  const m = String(u || "").match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export function TraderStories() {
  const [stories, setStories] = useState(null);
  const [form, setForm] = useState({ name: "", city: "", title: "", story: "", rating: 5, video_url: "", payout_amount: "" });
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { api.get("/stories").then((r) => setStories(r.data)).catch(() => setStories([])); }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/stories", form);
      toast.success("Thanks! Your story will appear after review.");
      setOpen(false);
      setForm({ name: "", city: "", title: "", story: "", rating: 5, video_url: "", payout_amount: "" });
    } catch (err) {
      toast.error(err?.response?.status === 401 ? "Please sign in to share your story" : (err?.response?.data?.detail || "Could not submit"));
    } finally { setBusy(false); }
  };
  const inp = "w-full rounded-lg bg-transparent border border-[var(--border-hi)] px-4 py-2.5 text-sm";
  return (
    <Shell chip="Trader Stories" title="Real traders. Real results." sub="Experiences shared by IndiFunded traders, reviewed by our team.">
      <button onClick={() => setOpen((v) => !v)} className="btn-amber rounded-full px-6 py-3 mb-8">{open ? "Close" : "Share your story"}</button>
      {open && (
        <form onSubmit={submit} className="glass-card p-6 grid sm:grid-cols-2 gap-3 mb-10 max-w-3xl">
          <input className={inp} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={80}/>
          <input className={inp} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={60}/>
          <input className={`${inp} sm:col-span-2`} placeholder="Headline" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={120}/>
          <textarea className={`${inp} sm:col-span-2 min-h-32`} placeholder="Your experience (min 20 characters)" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} required minLength={20} maxLength={2000}/>
          <input className={inp} placeholder="YouTube video link (optional)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} maxLength={300}/>
          <input className={inp} type="number" min="0" placeholder="Payout received ₹ (optional)" value={form.payout_amount} onChange={(e) => setForm({ ...form, payout_amount: e.target.value })}/>
          <select className={inp} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n} className="bg-[var(--surface)]">{n} stars</option>)}
          </select>
          <button disabled={busy} className="btn-amber rounded-full px-6 py-2.5">{busy ? "Sending…" : "Submit for review"}</button>
        </form>
      )}
      {stories === null ? <div className="text-[var(--muted)]">Loading…</div> : stories.length === 0 ? (
        <div className="glass-card p-6 text-[var(--muted)]">No stories yet — be the first to share yours.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((s) => {
            const v = ytEmbed(s.video_url);
            return (
              <article key={s.id} className="glass-card hover-lift p-6 flex flex-col">
                {v && <div className="aspect-video rounded-lg overflow-hidden mb-4"><iframe src={v} title={s.title} className="w-full h-full" allowFullScreen loading="lazy"/></div>}
                <div className="flex gap-0.5 text-[var(--accent-hi)]">{Array.from({ length: s.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor"/>)}</div>
                <h3 className="font-display text-xl mt-3">{s.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed flex-1">{s.story}</p>
                <div className="text-sm mt-4">{s.name}{s.city ? `, ${s.city}` : ""}{s.payout_amount ? <span className="text-[var(--emerald)]"> · ₹{Number(s.payout_amount).toLocaleString("en-IN")} payout</span> : null}</div>
              </article>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
