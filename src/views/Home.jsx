import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { api, formatINR } from "../lib/api";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import ChallengePicker from "../components/ChallengePicker";
import ClientReviews from "../components/ClientReviews";
import PayoutCertificates from "../components/PayoutCertificates";
import WeeklyHighestPayout from "../components/WeeklyHighestPayout";
import ProfitCalculator from "../components/ProfitCalculator";
import { HeroFX, Ticker } from "../components/HeroFX";
import { useReveal } from "../lib/useReveal";
import ScrollStatement from "../components/ScrollStatement";
import { ArrowRight, ShieldCheck, Trophy, Wallet, Target, Clock3, Headphones, Youtube, MessageCircle, TrendingUp, Check, ChevronDown, LayoutDashboard, BookOpen } from "lucide-react";

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { settings } = useSettings();
  const { user } = useAuth();
  const h = settings.hero;
  const sections = settings.home_sections || {};
  const href = user ? "/challenges" : "/login?next=/challenges";
  const show = name => sections[name] !== false;
  const faqs = (settings.faq_groups || []).flatMap(group => group.items || []).slice(0, 6);
  useEffect(() => {
    api.get("/plans").then(r => setPlans(r.data)).catch(() => {});
    api.get("/blogs").then(r => setBlogs(r.data)).catch(() => {});
  }, []);
  useReveal([plans.length, blogs.length]);
  return <div className="funded-home">
    <section className="home-hero">
      <HeroFX />
      <div className="container-xl home-hero-inner">
        <div className="home-eyebrow"><span className="home-status-dot" /> {h.chip}</div>
        <div className="home-brand-name">IndiFunded</div>
        <h1 className="font-display">{h.title_before}<br /><span>{h.title_highlight}</span> {h.title_after}</h1>
        <p className="home-hero-subtitle">{h.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Button asChild size="lg" className="home-primary-cta"><Link to={href} data-testid="hero-cta-primary">{h.cta_primary} <ArrowRight /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/rules" data-testid="hero-cta-secondary">{h.cta_secondary} <BookOpen /></Link></Button>
        </div>
        <div className="home-assurances"><span><ShieldCheck /> Clear challenge rules</span><span><Wallet /> One-time fee</span><span><Headphones /> Trader support</span></div>
        <div className="home-hero-stats">{(h.stats || []).map((stat, i) => <div key={i} data-testid={`hero-stat-${i}`}><strong className="font-display">{stat.k}</strong><span>{stat.v}</span></div>)}</div>
      </div>
    </section>
    <Ticker />
    {show("plans") && <>
      <section data-reveal className="home-band home-plan-intro"><div className="container-xl">
        <div className="home-section-heading"><div><div className="home-eyebrow">Built for Indian markets</div><h2 className="font-display">Your next chapter starts here</h2><p>Find the capital that fits your trading journey.</p></div><Button asChild variant="outline"><Link to="/challenges">Explore challenges <ArrowRight /></Link></Button></div>
        <div className="home-plan-grid">{plans.map(plan => <article data-reveal className="home-plan-card" key={plan.id}><div className="flex justify-between items-start"><span className="home-plan-gem" aria-hidden="true"><Target className="home-plan-icon" /></span>{plan.popular && <span className="home-plan-badge">Popular choice</span>}</div><h3 className="font-display">{plan.name}</h3><div className="home-plan-size">{formatINR(plan.account_size)}</div><ul>{(plan.features || []).slice(0, 3).map(feature => <li key={feature}><Check />{feature}</li>)}</ul><Button asChild variant="link" className="px-0"><Link to={href}>From {formatINR(plan.challenge_fee)} <ArrowRight /></Link></Button></article>)}</div>
      </div></section>
      <ChallengePicker plans={plans} href={href} />
    </>}
    {show("payouts") && <div className="home-proof-band"><PayoutCertificates /><WeeklyHighestPayout /></div>}
    {show("reviews") && <ClientReviews />}
    <ScrollStatement text="Traders return to a system that is clear, fair, and built for Indian markets." />
    {show("steps") && <section data-reveal className="home-band"><div className="container-xl">
      <div className="home-section-heading"><div><div className="home-eyebrow">How it works</div><h2 className="font-display">{settings.steps.title_prefix}<br />{settings.steps.title_suffix}</h2><p>Choose your account. Read the rules. Make your next move.</p></div><Button asChild variant="outline"><Link to="/how-it-works">The full journey <ArrowRight /></Link></Button></div>
      <div className="home-steps">{(settings.steps.items || []).map((step, i) => { const Icon = [Target, ShieldCheck, Trophy][i] || Target; return <div data-reveal className="home-step" key={i}><div className="home-step-top"><span>STEP {step.n}</span><Icon /></div><h3 className="font-display">{step.t}</h3><p>{step.d}</p></div>; })}</div>
    </div></section>}
    {show("benefits") && <section data-reveal className="home-band home-platform-band"><div className="container-xl">
      <div className="home-section-heading"><div><div className="home-eyebrow">Made for your next move</div><h2 className="font-display">A trading journey.<br />Not just a challenge.</h2></div></div>
      <div className="home-feature-grid">
        <article data-reveal className="home-feature"><div className="home-feature-art" aria-hidden="true"><Target size={56} /><ShieldCheck size={34} /></div><h3 className="font-display">Discipline comes first</h3><p>Profit targets, loss limits and trading days — see every rule before you start.</p><Button asChild variant="link" className="px-0"><Link to="/rules">Read the rules <ArrowRight /></Link></Button></article>
        <article data-reveal className="home-feature"><div className="home-feature-art" aria-hidden="true"><LayoutDashboard size={64} /><TrendingUp size={32} /></div><h3 className="font-display">Your journey, connected</h3><p>Your accounts, certificates and payout requests together in your IndiFunded dashboard.</p><Button asChild variant="link" className="px-0"><Link to={user ? "/app" : "/login"}>Your dashboard <ArrowRight /></Link></Button></article>
        <article data-reveal className="home-feature"><div className="home-feature-art" aria-hidden="true"><Wallet size={60} /><Check size={30} /></div><h3 className="font-display">A straightforward start</h3><p>One challenge fee, transparent plan rules, and a clear path to your funded account.</p><Button asChild variant="link" className="px-0"><Link to="/challenges">Compare plans <ArrowRight /></Link></Button></article>
      </div>
    </div></section>}
    {show("calculator") && <ProfitCalculator />}
    {show("community") && <section data-reveal className="home-band"><div className="container-xl"><div className="home-section-heading"><div><div className="home-eyebrow">Beyond the charts</div><h2 className="font-display">A community that adds value</h2><p>Connect with traders. Share the journey.</p></div></div><div className="home-community-grid">
      {settings.social?.youtube && <a className="home-community-item" href={settings.social.youtube} target="_blank" rel="noopener noreferrer"><Youtube size={42} /><div><h3 className="font-display">YouTube community</h3><p>Trader journeys, market insights and IndiFunded updates.</p><span>Visit our channel <ArrowRight size={16} /></span></div></a>}
      {settings.social?.whatsapp_link && <a className="home-community-item" href={settings.social.whatsapp_link} target="_blank" rel="noopener noreferrer"><MessageCircle size={42} /><div><h3 className="font-display">Stay connected</h3><p>Reach the IndiFunded team and stay up to date.</p><span>Join the conversation <ArrowRight size={16} /></span></div></a>}
    </div></div></section>}
    {show("blogs") && blogs.length > 0 && <section data-reveal className="home-band"><div className="container-xl"><div className="home-section-heading"><div><div className="home-eyebrow">From the journal</div><h2 className="font-display">A little insight. A better next trade.</h2></div><Button asChild variant="outline"><Link to="/blog">All articles <ArrowRight /></Link></Button></div><div className="home-blog-grid">{blogs.slice(0, 3).map(blog => <Link to={`/blog/${blog.slug}`} key={blog.id} className="home-blog-item">{blog.cover_image && <img src={blog.cover_image} alt="" loading="lazy" />}<h3 className="font-display">{blog.title}</h3><p>{blog.excerpt}</p><span>Read story <ArrowRight size={16} /></span></Link>)}</div></div></section>}
    {show("faq") && <section data-reveal className="home-band"><div className="container-xl home-faq-layout"><div><div className="home-eyebrow">The details matter</div><h2 className="font-display">Questions?<br />Let's clear them up.</h2><Button asChild variant="link" className="px-0 mt-4"><Link to="/faq">All questions <ArrowRight /></Link></Button></div><div>{faqs.map((faq, i) => <details className="home-faq" key={i}><summary>{faq.q}<ChevronDown size={18} /></summary><p>{faq.a}</p></details>)}</div></div></section>}
    {show("support") && <section data-reveal className="home-band home-support"><div className="container-xl"><Headphones size={44} /><div className="home-section-heading mt-5"><div><div className="home-eyebrow">We're here for you</div><h2 className="font-display">Support that keeps you moving</h2><p>Talk to the IndiFunded team on WhatsApp, email or phone.</p></div><Button asChild size="lg"><Link to="/contact">Contact support <ArrowRight /></Link></Button></div><div className="home-contact-options"><a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a><a href={`tel:${settings.contact.phone}`}>{settings.contact.phone}</a><Link to="/faq">Help & answers <ArrowRight size={16} /></Link></div></div></section>}
    <section className="home-closing"><div className="container-xl"><div className="home-eyebrow">Your next move</div><h2 className="font-display">Start your<br /><span>IndiFunded</span> challenge.</h2><Button asChild size="lg" className="home-primary-cta mt-7"><Link to={href}>Choose your challenge <ArrowRight /></Link></Button><p>Read the rules. Find your plan. Trade with purpose.</p></div></section>
  </div>;
}
