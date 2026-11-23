import type { PlateKind } from "@/data/projects";

/**
 * Stand-in for photography: a tonal panel carrying an architectural drawing.
 * Every stroke uses pathLength=1 so Motion can draw it in on reveal.
 * Swap for <Image> once OSDO's photographs arrive.
 */
const L = { pathLength: 1 } as const;

function Plan() {
  const doors = [
    [120, 90, 0],
    [280, 90, 90],
    [120, 210, 270],
    [280, 210, 180],
  ];
  return (
    <g>
      <rect x="60" y="40" width="280" height="220" {...L} />
      <rect x="66" y="46" width="268" height="208" {...L} />
      <rect x="150" y="105" width="100" height="90" {...L} />
      <path d="M60 105 H150 M250 105 H340 M60 195 H150 M250 195 H340 M200 40 V105 M200 195 V260" {...L} />
      <circle cx="200" cy="150" r="22" {...L} />
      <circle cx="200" cy="150" r="3" {...L} />
      {doors.map(([x, y, r], i) => (
        <path key={i} d="M0 0 H18 A18 18 0 0 1 0 18" transform={`translate(${x} ${y}) rotate(${r})`} {...L} />
      ))}
      <path d="M150 150 H128 M250 150 H272" strokeDasharray="2 3" {...L} />
      {[80, 120, 160, 240, 280, 320].map((x) => (
        <path key={x} d={`M${x} 268 V276`} {...L} />
      ))}
      <path d="M60 272 H340" {...L} />
    </g>
  );
}

function Section() {
  return (
    <g>
      <path d="M20 240 H380" {...L} />
      <path d="M70 240 V80 H330 V240 M70 133 H330 M70 186 H330" {...L} />
      <path d="M150 80 V240 M250 80 V240" strokeDasharray="3 3" {...L} />
      <path d="M150 80 L175 60 L200 80 M200 80 L225 60 L250 80" {...L} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${160 + i * 14} 20 L${150 + i * 14} 238`} strokeOpacity=".45" {...L} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <path key={`h${i}`} d={`M${24 + i * 22} 240 l-10 12`} {...L} />
      ))}
      <circle cx="350" cy="40" r="12" {...L} />
    </g>
  );
}

function Elevation() {
  const cells = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 14; c++)
      if ((r + c) % 2 === 0) cells.push(<rect key={`${r}-${c}`} x={92 + c * 16 + (r % 2) * 4} y={68 + r * 18} width="8" height="6" {...L} />);
  return (
    <g>
      <path d="M20 250 H380" {...L} />
      <rect x="80" y="50" width="240" height="200" {...L} />
      <path d="M80 50 L80 40 H320 V50" {...L} />
      {cells}
      <rect x="180" y="222" width="40" height="28" {...L} />
    </g>
  );
}

function Axo() {
  // isometric blocks
  const box = (x: number, y: number, w: number, d: number, h: number, k: number) => {
    const c = 0.5;
    const p = (dx: number, dy: number, dz: number) => `${x + (dx - dy) * 0.866} ${y + (dx + dy) * c - dz}`;
    return (
      <g key={k}>
        <path d={`M${p(0, 0, h)} L${p(w, 0, h)} L${p(w, d, h)} L${p(0, d, h)} Z`} {...L} />
        <path d={`M${p(w, 0, h)} L${p(w, 0, 0)} L${p(w, d, 0)} L${p(w, d, h)}`} {...L} />
        <path d={`M${p(0, d, h)} L${p(0, d, 0)} L${p(w, d, 0)}`} {...L} />
      </g>
    );
  };
  return (
    <g>
      {box(200, 110, 120, 90, 60, 1)}
      {box(200, 50, 70, 50, 40, 2)}
      {box(120, 140, 50, 40, 20, 3)}
      <path d="M60 250 L200 180 L340 250" strokeDasharray="2 4" {...L} />
    </g>
  );
}

function SitePlan() {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M-10 ${70 + i * 30} C 80 ${40 + i * 30}, 150 ${110 + i * 28}, 230 ${80 + i * 30} S 360 ${50 + i * 32}, 420 ${85 + i * 30}`}
          strokeOpacity=".55"
          {...L}
        />
      ))}
      <rect x="150" y="110" width="100" height="70" {...L} />
      <path d="M200 180 C 200 220, 120 230, 90 300" {...L} />
      {[
        [90, 80, 14],
        [300, 90, 18],
        [320, 200, 12],
        [110, 200, 16],
        [270, 240, 10],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} {...L} />
          <path d={`M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3}`} {...L} />
        </g>
      ))}
      <path d="M360 30 L360 60 M352 46 L360 30 L368 46" {...L} />
    </g>
  );
}

function Detail() {
  const chips = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) {
    const x = 70 + rnd() * 260;
    const y = 60 + rnd() * 120;
    const r = 2 + rnd() * 6;
    chips.push(<path key={i} d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r * 0.7} L${x - r * 0.8} ${y} Z`} {...L} />);
  }
  return (
    <g>
      <rect x="60" y="50" width="280" height="140" {...L} />
      {chips}
      <path d="M60 210 H340 M60 222 H340 M60 236 H340" {...L} />
      {Array.from({ length: 28 }, (_, i) => (
        <path key={`d${i}`} d={`M${60 + i * 10} 236 l8 -14`} strokeOpacity=".5" {...L} />
      ))}
      <path d="M40 50 V236 M36 50 H44 M36 236 H44" {...L} />
    </g>
  );
}

const drawings: Record<PlateKind, () => React.ReactElement> = {
  plan: Plan,
  section: Section,
  elevation: Elevation,
  axo: Axo,
  site: SitePlan,
  detail: Detail,
};

export const kindLabel: Record<PlateKind, string> = {
  plan: "Plan",
  section: "Section",
  elevation: "Elevation",
  axo: "Axonometric",
  site: "Site plan",
  detail: "Detail",
};

export default function Plate({
  kind,
  tone = 0,
  label,
  className = "",
  draw = true,
}: {
  kind: PlateKind;
  tone?: number;
  label?: string;
  className?: string;
  draw?: boolean;
}) {
  const D = drawings[kind];
  return (
    <div className={`plate tone-${tone % 6} ${className}`} data-draw={draw ? "" : undefined} role="img" aria-label={`${label ?? kindLabel[kind]} drawing, placeholder for photography`}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <D />
      </svg>
      <span className="plate-tag" aria-hidden="true">
        {kindLabel[kind]} · photo to come
      </span>
    </div>
  );
}
