import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { formatINR } from "../lib/api";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// FundedNext-style challenge picker: account-size tabs + rules table for the selected plan.
export default function ChallengePicker({ plans, href }) {
  const sorted = [...plans].sort((a, b) => (a.account_size || 0) - (b.account_size || 0));
  const [sel, setSel] = useState(null);
  useEffect(() => {
    if (!sel && sorted.length) setSel((sorted.find((p) => p.popular) || sorted[0]).id);
  }, [plans]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = sorted.find((x) => x.id === sel);
  if (!sorted.length) return null;
  const rows = p ? [
    ["Profit target", p.profit_target_points ? `${p.profit_target_points} points` : "—"],
    ["Maximum loss", p.max_loss_limit ? `${p.max_loss_limit}%` : "—"],
    ["Minimum trading days", p.min_trading_days ?? "—"],
    ["Trading period", p.total_trading_days ? `${p.total_trading_days} days` : "Unlimited"],
    ["Trades per day", p.trades_per_day ?? "—"],
    ["Profit share", p.profit_share ? `Up to ${p.profit_share}%` : "70%"],
  ] : [];
  return (
    <section className="container-xl py-20 md:py-28" data-testid="challenge-picker">
      <div className="text-center max-w-2xl mx-auto">
        <div className="chip mb-4 mx-auto">Challenges</div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl">Choose your challenge</h2>
        <p className="text-[var(--muted)] mt-4">Pick an account size. Same simple rules, one fee, 70% profit share.</p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full border border-[var(--border-hi)] bg-[var(--surface)]">
          {sorted.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)}
              className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${sel === x.id ? "btn-amber" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              data-testid={`picker-tab-${x.id}`}>
              {formatINR(x.account_size)}
            </button>
          ))}
        </div>
      </div>

      {p && (
        <div className="mt-10 grid lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          <div className="lg:col-span-3 card-panel overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-[var(--border)] flex justify-between items-center">
              <div className="font-display text-xl">{p.name} rules</div>
              {p.popular && <span className="chip">Most popular</span>}
            </div>
            {rows.map(([k, v]) => (
              <div key={k} className="px-6 md:px-8 py-4 flex justify-between border-b border-[var(--border)] last:border-0 text-sm md:text-base">
                <span className="text-[var(--muted)]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 card-panel glow-border p-6 md:p-8 flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[var(--muted-2)] font-mono">{p.name}</div>
            <div className="font-display text-4xl md:text-5xl mt-2">{formatINR(p.account_size)}</div>
            <div className="text-sm text-[var(--muted)] mt-1">Funded account</div>
            <div className="mt-6 space-y-2 flex-1">
              {(p.features || []).slice(0, 5).map((f) => (
                <div key={f} className="flex gap-2 text-sm text-[var(--muted)]"><CheckCircle2 size={15} className="mt-0.5 text-[var(--emerald)] shrink-0"/>{f}</div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--muted-2)]">One-time fee</div>
              <div className="flex items-baseline gap-2">
                <div className="font-display text-3xl">{formatINR(p.challenge_fee)}</div>
                {p.original_price > p.challenge_fee && <div className="text-sm line-through text-[var(--muted-2)]">{formatINR(p.original_price)}</div>}
              </div>
              <Link to={href} className="btn-amber rounded-full w-full mt-5 py-3.5 inline-flex justify-center items-center gap-2" data-testid="picker-buy">
                Start challenge <ArrowRight size={16}/>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
