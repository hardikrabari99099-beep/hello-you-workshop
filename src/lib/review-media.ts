export type ReviewMedia = { kind: "video" | "youtube" | "vimeo"; url: string };

export function getReviewMedia(value: string): ReviewMedia | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
      if (!id || !/^[\w-]{11}$/.test(id)) return null;
      return { kind: "youtube", url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/\/(\d+)\/?$/)?.[1];
      return id ? { kind: "vimeo", url: `https://player.vimeo.com/video/${id}?autoplay=1` } : null;
    }
    if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return { kind: "video", url: url.href };
    return null;
  } catch { return null; }
}

export function safeReviewImage(value: string): string | undefined {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : undefined; }
  catch { return undefined; }
}