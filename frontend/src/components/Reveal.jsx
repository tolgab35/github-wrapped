import { useRef, useState, useEffect } from "react";

export default function Reveal({ children, delay = 0, className = "", style = {}, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    const fallback = setTimeout(() => setShown(true), 1100);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${shown ? "rise" : ""} ${className}`.trim()}
      style={{ animationDelay: `${delay}ms`, opacity: shown ? undefined : 0, ...style }}
    >
      {children}
    </Tag>
  );
}
