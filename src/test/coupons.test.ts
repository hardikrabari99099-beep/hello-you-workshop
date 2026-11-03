import { describe, expect, it } from "vitest";
import { couponUsable } from "@/server/api-handler";

describe("coupon rules", () => {
  it("rejects a coupon that reached its max uses", () => {
    expect(couponUsable({ active: true, max_uses: 500, used_count: 500 })).toBe(false);
  });
  it("rejects an expired coupon", () => {
    expect(couponUsable({ active: true, expires_at: "2020-01-01T00:00:00Z" })).toBe(false);
  });
  it("accepts an active coupon with uses left", () => {
    expect(couponUsable({ active: true, max_uses: null, used_count: 3 })).toBe(true);
  });
});
