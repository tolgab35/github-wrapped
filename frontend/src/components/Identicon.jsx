function hashSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export default function Identicon({ seed = "octo", size = 56, color }) {
  const h = hashSeed(seed);
  const cells = [];
  const fill = color || `hsl(${h % 360} 52% 55%)`;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 5; y++) {
      const on = ((h >> (x * 5 + y)) & 1) === 1;
      if (on) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      style={{ display: "block", borderRadius: "50%", background: "var(--surface-2)", flexShrink: 0 }}
    >
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1.02} height={1.02} fill={fill} />
      ))}
    </svg>
  );
}
