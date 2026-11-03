import { useState } from "react";
import { Play, Quote, Star, TrendingUp, Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useSettings } from "../context/SettingsContext";
import { getReviewMedia, safeReviewImage } from "../lib/review-media";

function mutedEmbed(media) {
  if (media.kind === "youtube") {
    const id = media.url.match(/embed\/([\w-]{11})/)?.[1];
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`;
  }
  if (media.kind === "vimeo") return media.url.replace("autoplay=1", "autoplay=1&muted=1&loop=1&background=1");
  return media.url;
}

function VideoTile({ item, onOpen, decorative }) {
  const media = getReviewMedia(item.url);
  const poster = safeReviewImage(item.poster);
  return (
    <button type="button" className="wall-video" onClick={() => onOpen(item)} tabIndex={decorative ? -1 : 0} aria-label={`Watch ${item.name || "trader"}'s review with sound`}>
      {media.kind === "video"
        ? <video src={media.url} poster={poster} autoPlay muted loop playsInline preload="metadata" />
        : <iframe src={mutedEmbed(media)} title={`${item.name || "Trader"} review`} allow="autoplay; encrypted-media" loading="lazy" tabIndex={-1} />}
      <span className="wall-video-shade" />
      <span className="wall-video-sound"><Volume2 size={14} /> Tap for sound</span>
      <span className="wall-video-meta"><strong>{item.name || "IndiFunded trader"}</strong><span>{item.label || item.role || "Trader review"}</span></span>
      <span className="wall-video-play"><Play fill="currentColor" size={18} /></span>
    </button>
  );
}

function QuoteTile({ item, accent }) {
  return (
    <article className={`review-quote ${accent ? "review-quote-accent" : ""}`}>
      <div className="flex items-center justify-between"><div className="flex gap-1 text-primary">{Array.from({ length: 5 }, (_, j) => <Star key={j} size={13} fill="currentColor" />)}</div><Quote size={20} className="text-muted-foreground" /></div>
      <blockquote>“{item.q}”</blockquote>
      <div className="review-author"><span className="review-avatar">{(item.a || "T").slice(0, 1)}</span><div><strong>{item.a}</strong><span>{item.r}</span></div></div>
    </article>
  );
}

function StatTile() {
  return (
    <div className="wall-stat" aria-hidden="true">
      <TrendingUp />
      <svg viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 50 L25 42 L50 46 L75 30 L100 34 L125 18 L150 24 L175 8 L200 12" /></svg>
      <strong className="font-display">70%</strong><span>Profit split for funded traders</span>
    </div>
  );
}

export default function ClientReviews() {
  const { settings } = useSettings();
  const cfg = settings.video_reviews || {};
  const videos = (cfg.items || []).filter(item => item.enabled !== false && getReviewMedia(item.url || ""));
  const reviews = settings.testimonials || [];
  const [active, setActive] = useState(null);
  const [failed, setFailed] = useState(false);
  const media = active ? getReviewMedia(active.url) : null;

  if (cfg.enabled === false || (!videos.length && !reviews.length)) return null;

  // Mix videos and quotes into one sequence, then deal them across 3 columns.
  const tiles = [];
  const max = Math.max(videos.length, reviews.length);
  for (let i = 0; i < max; i++) {
    if (videos[i]) tiles.push({ type: "video", item: videos[i] });
    if (reviews[i]) tiles.push({ type: "quote", item: reviews[i] });
    if (i === 0) tiles.push({ type: "stat" });
  }
  const columns = [0, 1, 2].map(c => {
    const own = tiles.filter((_, i) => i % 3 === c);
    return own.length ? own : tiles;
  });
  const open = item => { setFailed(false); setActive(item); };

  const render = (t, key, decorative, i) =>
    t.type === "video" ? <VideoTile key={key} item={t.item} onOpen={open} decorative={decorative} />
      : t.type === "stat" ? <StatTile key={key} />
      : <QuoteTile key={key} item={t.item} accent={i % 3 === 1} />;

  return (
    <section className="home-band reviews-band" data-testid="client-reviews">
      <div className="container-xl">
        <div className="home-section-heading reviews-heading">
          <div><div className="home-eyebrow">Trader voices</div><h2 className="font-display">{cfg.heading || "The people behind the payouts"}</h2><p>{cfg.subtitle || "Trading journeys, in their own words."}</p></div>
        </div>
        <div className="review-wall" data-testid="video-review-track">
          {columns.map((list, c) => {
            const reps = Math.max(2, Math.ceil(8 / list.length)) * 2;
            return <div className={`review-col review-col-${c}`} key={c}><div className="review-col-track">
              {Array.from({ length: reps }, (_, r) => list.map((t, i) => render(t, `${r}-${i}`, r > 0, i + c))).flat()}
            </div></div>;
          })}
        </div>
      </div>
      <Dialog open={!!active} onOpenChange={value => { if (!value) setActive(null); }}>
        <DialogContent className="max-w-4xl"><DialogTitle>{active?.name || "Trader"}'s review</DialogTitle><DialogDescription>{active?.role || "IndiFunded trading journey"}</DialogDescription>
          {media && !failed && (media.kind === "video" ? <video className="review-player" src={media.url} controls autoPlay playsInline onError={() => setFailed(true)} /> : <iframe className="review-player" src={media.url} title={`${active?.name}'s video review`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />)}
          {failed && <p role="alert" className="text-muted-foreground">This video is unavailable right now.</p>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
