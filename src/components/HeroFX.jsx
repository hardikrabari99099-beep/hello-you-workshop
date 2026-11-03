import { TrendingUp, ShieldCheck, Wallet, Trophy, Zap, BadgeIndianRupee } from "lucide-react";

const candles = Array.from({ length: 22 }, (_, i) => {
  const base = 120 - i * 3.6 + Math.sin(i * 1.3) * 14;
  const up = i % 3 !== 1;
  return { x: 20 + i * 27, y: base, h: 18 + ((i * 7) % 26), up };
});

export function HeroFX() {
  return (
    <div className="hero-fx" aria-hidden="true">
      <div className="hero-grid" />
      <span className="hero-orb hero-orb-a" />
      <span className="hero-orb hero-orb-b" />
      <svg className="hero-chart" viewBox="0 0 620 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hfill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {candles.map((c, i) => <g key={i} className="hero-candle" style={{ animationDelay: `${i * 70}ms` }}>
          <line x1={c.x + 5} x2={c.x + 5} y1={c.y - 10} y2={c.y + c.h + 10} />
          <rect x={c.x} y={c.y} width="10" height={c.h} rx="2" className={c.up ? "up" : "down"} />
        </g>)}
        <path className="hero-line-fill" d={`M20 ${candles[0].y} ${candles.map(c => `L${c.x + 5} ${c.y}`).join(" ")} L620 200 L20 200Z`} fill="url(#hfill)" />
        <path className="hero-line" d={`M20 ${candles[0].y} ${candles.map(c => `L${c.x + 5} ${c.y}`).join(" ")}`} />
      </svg>
      <div className="hero-float hero-float-1"><TrendingUp /> <div><strong>+8.4%</strong><span>Phase target hit</span></div></div>
      <div className="hero-float hero-float-2"><BadgeIndianRupee /> <div><strong>Payout sent</strong><span>Funded trader</span></div></div>
      <div className="hero-float hero-float-3"><ShieldCheck /> <div><strong>Risk capped</strong><span>One-time fee</span></div></div>
    </div>
  );
}

const ticks = [
  [Zap, "NIFTY 50 · BANKNIFTY · NSE"], [Wallet, "Up to 70% profit split"], [Trophy, "Funded up to ₹5,00,000"],
  [ShieldCheck, "Clear, published rules"], [BadgeIndianRupee, "Payouts within 24 hours"], [TrendingUp, "Built for Indian traders"],
];

export function Ticker() {
  return (
    <div className="home-ticker" aria-hidden="true">
      <div className="home-ticker-track">
        {[0, 1].map(k => <div className="home-ticker-group" key={k}>
          {ticks.map(([Icon, t], i) => <span key={i}><Icon size={16} />{t}</span>)}
        </div>)}
      </div>
    </div>
  );
}
