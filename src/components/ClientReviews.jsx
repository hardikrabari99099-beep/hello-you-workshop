import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Quote, Star, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useSettings } from "../context/SettingsContext";
import { Link } from "@/lib/router-compat";
import { getReviewMedia, safeReviewImage } from "../lib/review-media";

export default function ClientReviews() {
  const { settings } = useSettings();
  const cfg = settings.video_reviews || {};
  const videos = (cfg.items || []).filter(item => item.enabled !== false && getReviewMedia(item.url || ""));
  const reviews = settings.testimonials || [];
  const track = useRef(null);
  const interacting = useRef(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(null);
  const [failed, setFailed] = useState(false);
  const media = active ? getReviewMedia(active.url) : null;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let previous = 0;
    const tick = time => {
      const el = track.current;
      if (el && previous && !paused && !active && !interacting.current && !reduced.matches && !document.hidden) {
        el.scrollLeft += Math.min(time - previous, 50) * 0.025;
        const boundary = el.scrollWidth / 2;
        if (el.scrollLeft >= boundary) el.scrollLeft -= boundary;
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    };
    if (videos.length > 1) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [videos.length, paused, active]);

  if (cfg.enabled === false || (!videos.length && !reviews.length)) return null;
  const shift = direction => {
    setPaused(true);
    track.current?.scrollBy({ left: direction * 304, behavior: "smooth" });
  };
  const open = item => { setFailed(false); setActive(item); };
  return (
    <section className="home-band reviews-band" data-testid="client-reviews">
      <div className="container-xl">
        <div className="home-section-heading">
          <div><div className="home-eyebrow">Trader voices</div><h2 className="font-display">{cfg.heading || "The people behind the payouts"}</h2><p>{cfg.subtitle || "Trading journeys, in their own words."}</p></div>
          {videos.length > 1 ? <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="icon" aria-label="Previous review" title="Previous review" onClick={() => shift(-1)}><ArrowLeft /></Button>
            <Button variant="outline" size="icon" aria-label={paused ? "Resume review scrolling" : "Pause review scrolling"} title={paused ? "Resume scrolling" : "Pause scrolling"} onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</Button>
            <Button variant="outline" size="icon" aria-label="Next review" title="Next review" onClick={() => shift(1)}><ArrowRight /></Button>
          </div> : <Button asChild variant="outline"><Link to="/stories">Trader stories <ArrowRight /></Link></Button>}
        </div>
      </div>
      {videos.length > 0 && <div ref={track} className="review-track" data-testid="video-review-track"
        onMouseEnter={() => { interacting.current = true; }} onMouseLeave={() => { interacting.current = false; }}
        onTouchStart={() => { interacting.current = true; setPaused(true); }} onTouchEnd={() => { interacting.current = false; }}
        onFocusCapture={() => { interacting.current = true; }} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) interacting.current = false; }}>
        {[0, ...(videos.length > 1 ? [1] : [])].map(copy => <div className="review-group" key={copy} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>
          {videos.map((item, i) => <Button key={item.id || i} variant="ghost" className="review-video-card" onClick={() => open(item)} aria-label={`Watch ${item.name || "trader"}'s review`}>
            <div className="review-video-cover">
              {safeReviewImage(item.poster) ? <img src={safeReviewImage(item.poster)} alt="" loading="lazy" onError={e => { e.currentTarget.hidden = true; }} /> : getReviewMedia(item.url)?.kind === "video" ? <video src={item.url} muted playsInline preload="metadata" tabIndex={-1} /> : <div className="review-monogram" aria-hidden="true">{(item.name || "IF").split(" ").map(n => n[0]).slice(0, 2).join("")}<Video /></div>}
              <span className="review-play"><Play fill="currentColor" /></span>
              <span className="review-caption">{item.label || "Trader review"}</span>
            </div>
            <div className="review-video-meta"><span>{item.name || "IndiFunded trader"}</span><span>{item.role || "Trading journey"}</span></div>
          </Button>)}
        </div>)}
      </div>}
      {reviews.length > 0 && <div className="container-xl"><div className="review-wall">
        {[0, 1, 2].map(col => { const list = reviews.filter((_, i) => i % 3 === col % reviews.length || reviews.length < 3); return <div className={`review-col review-col-${col}`} key={col}><div className="review-col-track">
          {Array.from({ length: Math.max(4, Math.ceil(8 / list.length)) * 2 }, () => list).flat().map((item, i) => <article className={`review-quote ${(i + col) % 3 === 1 ? "review-quote-accent" : ""}`} key={i} aria-hidden={i >= list.length ? true : undefined}><div className="flex items-center justify-between"><div className="flex gap-1 text-primary">{Array.from({ length: 5 }, (_, j) => <Star key={j} size={13} fill="currentColor" />)}</div><Quote size={20} className="text-muted-foreground" /></div><blockquote>“{item.q}”</blockquote><div className="review-author"><span className="review-avatar">{(item.a || "T").slice(0, 1)}</span><div><strong>{item.a}</strong><span>{item.r}</span></div></div></article>)}
        </div></div>; })}
      </div></div>}
      <Dialog open={!!active} onOpenChange={value => { if (!value) setActive(null); }}>
        <DialogContent className="max-w-4xl"><DialogTitle>{active?.name || "Trader"}'s review</DialogTitle><DialogDescription>{active?.role || "IndiFunded trading journey"}</DialogDescription>
          {media && !failed && (media.kind === "video" ? <video className="review-player" src={media.url} controls autoPlay playsInline onError={() => setFailed(true)} /> : <iframe className="review-player" src={media.url} title={`${active?.name}'s video review`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />)}
          {failed && <p role="alert" className="text-muted-foreground">This video is unavailable right now.</p>}
        </DialogContent>
      </Dialog>
    </section>
  );
}