import { useState, useEffect, useRef } from "react";

export default function useCountUp(target, { duration = 1400, animate = true, start = 0 } = {}) {
  const [val, setVal] = useState(animate ? start : target);
  const raf = useRef(null);

  useEffect(() => {
    if (!animate) { setVal(target); return; }
    let t0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      if (t0 == null) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      setVal(Math.round(start + (target - start) * ease(p)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, animate]);

  return val;
}
