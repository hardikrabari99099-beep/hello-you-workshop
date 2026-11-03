import { useEffect, useRef, useState } from "react";

export default function ScrollStatement({ text }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.3))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const words = text.split(" ");
  return <section className="scroll-statement" ref={ref}><div className="container-xl"><h2 className="font-display">
    {words.map((w, i) => <span key={i} className={i / words.length < p ? "lit" : ""}>{w} </span>)}
  </h2></div></section>;
}
