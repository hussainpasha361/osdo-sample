import type { PlaceholderMedia, PlateDrawing } from "@/content/types";

/**
 * Development placeholder: a tonal panel carrying a generic architectural
 * drawing and a printed label, so it can never be mistaken for OSDO work.
 */
const L = { pathLength: 1 } as const;

function Plan() {
  return (
    <g>
      <rect x="70" y="50" width="260" height="200" {...L} />
      <path d="M70 120 H170 M230 120 H330 M200 50 V120 M70 190 H140 M200 190 V250 M260 190 H330" {...L} />
      <path d="M170 120 A30 30 0 0 1 200 150 M140 190 A26 26 0 0 0 166 216" {...L} />
      <circle cx="265" cy="225" r="14" {...L} />
      <path d="M70 268 H330 M70 264 V272 M200 264 V272 M330 264 V272" {...L} />
    </g>
  );
}
function Section() {
  return (
    <g>
      <path d="M20 240 H380" {...L} />
      <path d="M80 240 V100 L200 50 L320 100 V240 M80 170 H320" {...L} />
      <path d="M140 170 V240 M260 170 V240" strokeDasharray="3 4" {...L} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${170 + i * 14} 30 L${150 + i * 14} 165`} strokeOpacity=".5" {...L} />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <path key={`h${i}`} d={`M${30 + i * 24} 240 l-10 12`} {...L} />
      ))}
    </g>
  );
}
function Elevation() {
  const fins = Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${96 + i * 17} 70 V240`} {...L} />);
  return (
    <g>
      <path d="M20 240 H380 M80 240 V60 H320 V240 M80 70 H320" {...L} />
      {fins}
      <path d="M176 240 V170 A24 24 0 0 1 224 170 V240" {...L} />
    </g>
  );
}
function Axo() {
  const box = (x: number, y: number, w: number, d: number, h: number, k: number) => {
    const p = (dx: number, dy: number, dz: number) => `${x + (dx - dy) * 0.866} ${y + (dx + dy) * 0.5 - dz}`;
    return (
      <g key={k}>
        <path d={`M${p(0, 0, h)} L${p(w, 0, h)} L${p(w, d, h)} L${p(0, d, h)} Z`} {...L} />
        <path d={`M${p(w, 0, h)} L${p(w, 0, 0)} L${p(w, d, 0)} L${p(w, d, h)} M${p(0, d, h)} L${p(0, d, 0)} L${p(w, d, 0)}`} {...L} />
      </g>
    );
  };
  return (
    <g>
      {box(200, 120, 110, 80, 56, 1)}
      {box(205, 62, 60, 46, 36, 2)}
      {box(128, 150, 44, 36, 18, 3)}
    </g>
  );
}
function Detail() {
  return (
    <g>
      <path d="M60 60 H340 V240 H60 Z M60 120 H340 M60 180 H340 M150 60 V240 M250 60 V240" {...L} />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${64 + i * 13} 236 l10 -14`} strokeOpacity=".5" {...L} />
      ))}
      <circle cx="200" cy="150" r="28" {...L} />
      <path d="M200 110 V190 M160 150 H240" {...L} />
    </g>
  );
}
function Site() {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M-10 ${70 + i * 34} C 90 ${40 + i * 34}, 170 ${110 + i * 30}, 250 ${80 + i * 34} S 370 ${50 + i * 34}, 420 ${85 + i * 32}`} strokeOpacity=".55" {...L} />
      ))}
      <rect x="160" y="110" width="90" height="64" {...L} />
      {[
        [90, 80, 16],
        [300, 92, 20],
        [318, 210, 12],
        [104, 206, 15],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} {...L} />
      ))}
    </g>
  );
}

const DRAWINGS: Record<PlateDrawing, () => React.ReactElement> = {
  plan: Plan,
  section: Section,
  elevation: Elevation,
  axo: Axo,
  detail: Detail,
  site: Site,
};

export default function Placeholder({ media, showLabel = true }: { media: PlaceholderMedia; showLabel?: boolean }) {
  const D = DRAWINGS[media.drawing];
  return (
    <div className={`plate tone-${media.tone}`} role="img" aria-label={media.alt}>
      <span className="plate-grid" aria-hidden="true" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <D />
      </svg>
      <i className="plate-reg" style={{ left: 10, top: 10 }} aria-hidden="true" />
      <i className="plate-reg" style={{ right: 10, top: 10 }} aria-hidden="true" />
      {showLabel ? (
        <span className="plate-label t-note" aria-hidden="true">
          {media.label}
        </span>
      ) : null}
    </div>
  );
}
