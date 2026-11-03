import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { api, formatINR } from "../lib/api";
import { useSEO } from "../lib/useSEO";
import { useReveal } from "../lib/useReveal";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import PayoutCertificates from "../components/PayoutCertificates";
import HowItWorks from "../components/HowItWorks";
import LivePayoutCounter from "../components/LivePayoutCounter";
import TrustStrip from "../components/TrustStrip";
import RatingsBar from "../components/RatingsBar";
import ProfitCalculator from "../components/ProfitCalculator";
import WeeklyHighestPayout from "../components/WeeklyHighestPayout";
import ChallengePicker from "../components/ChallengePicker";
import { ArrowRight, ShieldCheck, Trophy, Flame, Rocket, Star, CheckCircle2, Youtube, MessageCircle } from "lucide-react";

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { settings } = useSettings();
  const { user } = useAuth();
  const challengesHref = user ? "/challenges" : "/login?next=/challenges";
  const h = settings.hero, st = settings.steps, tests = settings.testimonials || [];
  useReveal([plans, blogs]);
  useSEO({
    title: "India's 1st Prop Trading Firm — Get Funded up to ₹5 Lakh",
    description: "IndiFunded — India's 1st prop trading firm. Pass the challenge, get a funded trading account up to ₹5,00,000. Trade NSE, BankNifty, Nifty50 with 70% profit split and 24-hour payouts.",
    path: "/",
  });
  useEffect(()=>{
    api.get("/plans").then(r=>setPlans(r.data)).catch(()=>{});
    api.get("/blogs").then(r=>setBlogs(r.data)).catch(()=>{});
  },[]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="aurora" aria-hidden="true"/>
        <div className="container-xl pt-16 md:pt-28 pb-16 md:pb-24 relative text-center flex flex-col items-center">
          <div className="reveal-up chip mb-5 md:mb-6" data-testid="hero-chip"><span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] animate-pulse"/> {h.chip}</div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-8xl font-semibold leading-[0.95] tracking-tight max-w-5xl reveal-up" style={{animationDelay:"80ms"}}>
            {h.title_before} <span className="text-[var(--accent)] pulse-accent">{h.title_highlight}</span> {h.title_after}
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-[var(--muted)] max-w-2xl mx-auto reveal-up" style={{animationDelay:"160ms"}}>
            {h.subtitle}
          </p>
          <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 reveal-up" style={{animationDelay:"240ms"}}>
            <Link to={challengesHref} className="btn-amber px-6 md:px-7 py-3 md:py-3.5 rounded-full inline-flex items-center gap-2 text-sm md:text-base" data-testid="hero-cta-primary">
              {h.cta_primary} <ArrowRight size={16}/>
            </Link>
            <Link to="/rules" className="btn-ghost px-6 md:px-7 py-3 md:py-3.5 rounded-full inline-flex items-center gap-2 text-sm md:text-base" data-testid="hero-cta-secondary">{h.cta_secondary}</Link>
          </div>

          {/* stat strip */}
          <div className="mt-14 md:mt-20 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 card-panel divide-x divide-[var(--border)] overflow-hidden reveal-up" style={{animationDelay:"320ms"}}>
            {(h.stats || []).map((s,i)=>(
              <div key={i} className="p-5 md:p-7" data-testid={`hero-stat-${i}`}>
                <div className="font-display text-2xl md:text-4xl text-white">{s.k}</div>
                <div className="text-[10px] md:text-xs tracking-wider uppercase text-[var(--muted-2)] mt-1 md:mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ticker removed — replaced by auto-playing certificate slider below */}
      </section>

      {/* TRUST STRIP */}
      <TrustStrip />

      {/* RATINGS (Trustpilot + PropFirmMatch) */}
      <RatingsBar />

      {/* LIVE COUNTER */}
      <LivePayoutCounter />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* PATH TO FUNDING */}
      <section className="container-xl py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="chip mb-4">Your Path to Funding</div>
            <h2 className="font-display text-4xl md:text-5xl max-w-2xl">{st.title_prefix} {st.title_suffix}</h2>
          </div>
          <Link to="/challenges" className="link-underline text-sm text-[var(--muted)]">See all plans →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(st.items || []).map((s,i)=>{
            const iconMap = [<Flame/>, <ShieldCheck/>, <Trophy/>];
            return (
              <div key={i} data-reveal data-reveal-delay={String((i%3)+1)} className="glass-card hover-lift p-7 relative" data-testid={`path-step-${i}`}>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-[var(--muted-2)]">STEP {s.n}</div>
                  <div className="w-10 h-10 rounded-xl grid place-items-center border border-[var(--border-hi)] text-[var(--accent)]">{iconMap[i] || <Flame/>}</div>
                </div>
                <div className="font-display text-2xl mt-10">{s.t}</div>
                <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{s.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CHALLENGE PICKER */}
      <ChallengePicker plans={plans} href={challengesHref} />

      {/* TESTIMONIALS */}
      <PayoutCertificates />

      {/* WEEKLY HIGHEST PAYOUT — per plan, last 7 days */}
      <WeeklyHighestPayout />

      {/* PROFIT CALCULATOR */}
      <ProfitCalculator />

      <section className="container-xl py-24">
        <div className="mb-12">
          <div className="chip mb-4">Stories</div>
          <h2 className="font-display text-4xl md:text-5xl max-w-3xl">Why traders choose IndiFunded</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {tests.map((t,i)=>(
            <div key={i} data-reveal data-reveal-delay={String((i%3)+1)} className="glass-card p-8 hover-lift" data-testid={`testimonial-${i}`}>
              <div className="flex gap-1 text-[var(--accent)] mb-4">{[...Array(5)].map((_,k)=><Star key={k} size={14} fill="currentColor"/>)}</div>
              <p className="text-base text-white/90 leading-relaxed">“{t.q}”</p>
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="font-display">{t.a}</div>
                <div className="text-xs text-[var(--muted-2)] font-mono uppercase tracking-wider mt-1">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOGS */}
      <section className="container-xl py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="chip mb-4">Insights</div>
            <h2 className="font-display text-4xl md:text-5xl">Latest Updates</h2>
          </div>
          <Link to="/blog" className="link-underline text-sm text-[var(--muted)]">Read all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {blogs.slice(0,3).map((b,i)=>(
            <Link to={`/blog/${b.slug}`} key={b.id} data-reveal data-reveal-delay={String((i%3)+1)} className="card-panel hover-lift overflow-hidden block" data-testid={`home-blog-${i}`}>
              <div className="h-44 bg-cover bg-center" style={{backgroundImage:`url(${b.cover_image})`}}/>
              <div className="p-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted-2)]">Article</div>
                <div className="font-display text-lg mt-2 line-clamp-2">{b.title}</div>
                <p className="text-sm text-[var(--muted)] mt-3 line-clamp-2">{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="container-xl py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="chip mb-4 mx-auto">Community</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl">A community that adds value</h2>
          <p className="text-[var(--muted)] mt-4">Learn, share setups and celebrate payouts with traders across India.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <a href={settings.social?.youtube || "#"} target="_blank" rel="noopener noreferrer" className="card-panel hover-lift p-8 flex items-start gap-5" data-testid="community-youtube">
            <div className="w-12 h-12 rounded-xl grid place-items-center border border-[var(--border-hi)] text-[var(--accent-hi)] shrink-0"><Youtube/></div>
            <div><div className="font-display text-2xl">YouTube community</div><p className="text-sm text-[var(--muted)] mt-2">Strategy breakdowns, payout proofs and live sessions.</p><div className="text-sm text-[var(--accent-hi)] mt-4 inline-flex items-center gap-1">Subscribe <ArrowRight size={14}/></div></div>
          </a>
          <a href={settings.social?.whatsapp_link || "#"} target="_blank" rel="noopener noreferrer" className="card-panel hover-lift p-8 flex items-start gap-5" data-testid="community-whatsapp">
            <div className="w-12 h-12 rounded-xl grid place-items-center border border-[var(--border-hi)] text-[var(--accent-hi)] shrink-0"><MessageCircle/></div>
            <div><div className="font-display text-2xl">WhatsApp community</div><p className="text-sm text-[var(--muted)] mt-2">Daily updates, announcements and quick help from our team.</p><div className="text-sm text-[var(--accent-hi)] mt-4 inline-flex items-center gap-1">Join now <ArrowRight size={14}/></div></div>
          </a>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="container-xl py-20 md:py-24">
        <div className="card-panel p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="chip mb-4">Support</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Support that never clocks out</h2>
            <p className="text-[var(--muted)] mt-4 max-w-md">Real people, fast answers — on WhatsApp, email and phone, every day of the week.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/contact" className="btn-amber rounded-full px-6 py-3 inline-flex items-center gap-2">Contact support <ArrowRight size={16}/></Link>
              <Link to="/faq" className="btn-ghost rounded-full px-6 py-3">Read FAQ</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["24/7","Availability"],["< 5 min","Avg. reply on WhatsApp"],["24h","Payout processing"],["Hindi + English","Languages"]].map(([k,v])=>(
              <div key={v} className="glass-card p-5"><div className="font-display text-2xl md:text-3xl">{k}</div><div className="text-xs text-[var(--muted-2)] uppercase tracking-wider mt-2">{v}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-xl pt-12 pb-24">
        <div className="card-panel glow-border relative overflow-hidden p-10 md:p-20 text-center" data-testid="bottom-cta">
          <div className="aurora" aria-hidden="true"/>
          <div className="relative">
            <h3 className="font-display text-4xl md:text-7xl max-w-3xl mx-auto leading-[1]">Start your IndiFunded challenge</h3>
            <p className="text-[var(--muted)] mt-5 max-w-xl mx-auto">Stop risking your own capital. Trade ours and keep 70% of the profits.</p>
            <Link to={challengesHref} className="btn-amber rounded-full px-8 py-4 mt-8 inline-flex items-center gap-2">Get funded <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
