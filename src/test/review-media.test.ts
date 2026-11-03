import { describe, expect, it } from "vitest";
import { getReviewMedia, safeReviewImage } from "../lib/review-media";

describe("admin review media", () => {
  it("supports direct HTTPS videos", () => {
    expect(getReviewMedia("https://media.example.com/trader.mp4?token=public")).toEqual({ kind: "video", url: "https://media.example.com/trader.mp4?token=public" });
  });
  it("converts YouTube watch and short links to privacy enhanced embeds", () => {
    expect(getReviewMedia("https://youtu.be/dQw4w9WgXcQ")?.url).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0");
    expect(getReviewMedia("https://www.youtube.com/watch?v=dQw4w9WgXcQ")?.kind).toBe("youtube");
  });
  it("converts Vimeo links", () => {
    expect(getReviewMedia("https://vimeo.com/123456789")?.url).toBe("https://player.vimeo.com/video/123456789?autoplay=1");
  });
  it("rejects executable URLs, insecure URLs and impostor providers", () => {
    for (const url of ["javascript:alert(1)", "http://media.example.com/a.mp4", "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ", "https://youtu.be/invalid", ""]) expect(getReviewMedia(url)).toBeNull();
    expect(safeReviewImage("javascript:alert(1)")).toBeUndefined();
  });
});