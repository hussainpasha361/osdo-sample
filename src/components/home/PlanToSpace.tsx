"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { RevealText } from "@/components/motion/Reveal";
import { approach } from "@/content/approach";

/**
 * From plan to space: one continuous drawing, scrubbed by scroll.
 *   Plan      walls draw as poché, dimensions appear
 *   Layout    furniture is drawn in outline
 *   Volume    the plan rotates and tilts into isometric; walls and furniture rise as a white model
 *   Material  colour washes in: stone, plaster, brick, timber, olive, orange
 *   Space     the pendant glows, planting grows, the room warms
 * Geometry is plain 3D boxes and faces, projected every frame. Illustrative only.
 */

type V3 = [number, number, number];
type Group = "floor" | "wall" | "cut" | "furn";
type Face = {
  pts: V3[];
  group: Group;
  model: string; // white study model
  mat: string; // material colour
  poche?: boolean; // dark in plan (and for cut walls, always)
  draw?: "wall" | "furn"; // outline draws in during that stage
  top?: boolean;
  appear?: "lintel";
};
type Line = { pts: V3[]; group: Group | "plan" | "detail" | "plant" | "late"; color?: string; width?: number; dash?: string };

const W = 420; // room width (x)
const D = 320; // room depth (y)
const H = 200; // wall height
const T = 12; // wall thickness
const LOW = 34; // cut height of the near walls

const C = {
  charcoal: "#252622",
  white: "#f4f0e8",
  whiteR: "#e6e0d4",
  whiteF: "#d7d0c2",
  floorM: "#ede8dd",
  stone: "#c8bead",
  plaster: "#ece4d5",
  brick: "#b4623c",
  wallTop: "#d9d1c3",
  olive: "#6b7653",
  oliveR: "#5a6446",
  oliveF: "#4b5439",
  orange: "#c36d38",
  orangeR: "#a95d2f",
  rug: "#d89a6b",
  timber: "#a47749",
  timberR: "#8b623a",
  timberF: "#77532f",
  terracotta: "#b5683f",
  oxblood: "#7a2a22",
};

function box(x0: number, x1: number, y0: number, y1: number, h: number, mat: [string, string, string], group: Group = "furn"): Face[] {
  return [
    { pts: [[x1, y0, 0], [x1, y1, 0], [x1, y1, h], [x1, y0, h]], group, model: C.whiteR, mat: mat[1] },
    { pts: [[x0, y1, 0], [x1, y1, 0], [x1, y1, h], [x0, y1, h]], group, model: C.whiteF, mat: mat[2] },
    { pts: [[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]], group, model: C.white, mat: mat[0], draw: group === "furn" ? "furn" : undefined, top: true },
  ];
}

/** Back wall (y = 0) and left wall (x = 0): inner faces plus caps; caps read as poché in plan. */
const ARCH = { x0: 300, x1: 370, spring: 112 };
const archPts = (): V3[] => {
  const pts: V3[] = [[ARCH.x0, 0, 0], [ARCH.x0, 0, ARCH.spring]];
  const r = (ARCH.x1 - ARCH.x0) / 2;
  const cx = ARCH.x0 + r;
  for (let a = 180; a >= 0; a -= 15) pts.push([cx + r * Math.cos((a * Math.PI) / 180), 0, ARCH.spring + r * Math.sin((a * Math.PI) / 180)]);
  pts.push([ARCH.x1, 0, 0]);
  return pts;
};

const FACES: Face[] = [
  // floor
  { pts: [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]], group: "floor", model: C.floorM, mat: C.stone },
  // rug
  { pts: [[96, 112, 0.5], [262, 112, 0.5], [262, 238, 0.5], [96, 238, 0.5]], group: "furn", model: C.white, mat: C.rug, draw: "furn", top: true },
  // back wall inner face + left wall inner face
  { pts: [[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]], group: "wall", model: C.white, mat: C.plaster },
  { pts: [[0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H]], group: "wall", model: C.whiteR, mat: C.brick },
  // arch opening (drawn on the back wall)
  { pts: archPts(), group: "wall", model: C.whiteF, mat: C.oxblood },
  // wall caps (plan poché)
  { pts: [[-T, -T, H], [ARCH.x0, -T, H], [ARCH.x0, 0, H], [-T, 0, H]], group: "wall", model: C.wallTop, mat: C.wallTop, poche: true, draw: "wall", top: true },
  { pts: [[ARCH.x1, -T, H], [W + T, -T, H], [W + T, 0, H], [ARCH.x1, 0, H]], group: "wall", model: C.wallTop, mat: C.wallTop, poche: true, draw: "wall", top: true },
  { pts: [[ARCH.x0, -T, H], [ARCH.x1, -T, H], [ARCH.x1, 0, H], [ARCH.x0, 0, H]], group: "wall", model: C.wallTop, mat: C.wallTop, appear: "lintel", top: true },
  { pts: [[-T, 0, H], [0, 0, H], [0, D, H], [-T, D, H]], group: "wall", model: C.wallTop, mat: C.wallTop, poche: true, draw: "wall", top: true },
  // furniture, back to front
  ...box(28, 46, 14, 228, 60, [C.olive, C.oliveR, C.oliveF]), // back B
  ...box(40, 252, 14, 30, 60, [C.olive, C.oliveR, C.oliveF]), // back A
  ...box(40, 252, 30, 80, 30, [C.olive, C.oliveR, C.oliveF]), // seat A
  ...box(46, 96, 80, 228, 30, [C.olive, C.oliveR, C.oliveF]), // seat B
  ...box(78, 116, 34, 52, 50, [C.orange, C.orangeR, C.orangeR]), // cushions
  ...box(140, 178, 34, 52, 50, [C.orange, C.orangeR, C.orangeR]),
  ...box(54, 72, 120, 158, 50, [C.orange, C.orangeR, C.orangeR]),
  ...box(130, 226, 128, 192, 26, [C.timber, C.timberR, C.timberF]), // coffee table
  ...box(356, 396, 28, 68, 46, [C.terracotta, "#9c5734", "#8a4c2d"]), // planter
  ...box(330, 404, 236, 296, 40, [C.timber, C.timberR, C.timberF]), // console
  // near walls, cut low (section caps stay dark)
  ...box(-T, 82, D, D + T, LOW, [C.charcoal, C.whiteR, C.whiteF], "cut"),
  ...box(172, W + T, D, D + T, LOW, [C.charcoal, C.whiteR, C.whiteF], "cut"),
  ...box(W, W + T, 0, D, LOW, [C.charcoal, C.whiteR, C.whiteF], "cut"),
];
FACES.forEach((f) => {
  if (f.group === "cut" && f.top) {
    f.poche = true;
    f.draw = "wall";
  }
});

function diagonals(): Line[] {
  const out: Line[] = [];
  for (let k = -D; k < W; k += 40) {
    const y0 = Math.max(0, -k);
    const y1 = Math.min(D, W - k);
    if (y1 > y0) out.push({ pts: [[k + y0, y0, 0.3], [k + y1, y1, 0.3]], group: "floor" });
  }
  for (let k = 0; k < W + D; k += 40) {
    const y0 = Math.max(0, k - W);
    const y1 = Math.min(D, k);
    if (y1 > y0) out.push({ pts: [[k - y0, y0, 0.3], [k - y1, y1, 0.3]], group: "floor" });
  }
  return out;
}

function plantLines(): Line[] {
  const out: Line[] = [];
  const base: V3 = [376, 48, 46];
  const fronds = [
    [-40, -10, 120],
    [30, 10, 130],
    [-10, 30, 150],
    [20, -30, 140],
    [-30, 26, 110],
    [40, -14, 112],
    [0, 0, 160],
  ];
  fronds.forEach(([dx, dy, dz]) => {
    const pts: V3[] = [];
    for (let i = 0; i <= 8; i++) {
      const s = i / 8;
      pts.push([base[0] + dx * s, base[1] + dy * s, base[2] + dz * Math.sin(s * 1.4) + 10 * s]);
    }
    out.push({ pts, group: "plant", color: C.olive, width: 1.6 });
  });
  return out;
}

const LINES: Line[] = [
  ...diagonals(),
  // timber battens on the back wall
  ...Array.from({ length: 9 }, (_, i): Line => ({ pts: [[200 + i * 10, 0.5, 0], [200 + i * 10, 0.5, H]], group: "detail", color: C.timberF, width: 2.2 })),
  // brick coursing on the left wall
  ...Array.from({ length: 15 }, (_, i): Line => ({ pts: [[0.5, 0, 12 + i * 12.5], [0.5, D, 12 + i * 12.5]], group: "detail", color: "#8f4b2c", width: 0.8 })),
  ...plantLines(),
  // pendant
  { pts: [[178, 160, H], [178, 160, 128]], group: "late", color: C.charcoal, width: 1 },
  // plan only: dimension lines, door swing
  { pts: [[0, -54, 0], [W, -54, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[0, -64, 0], [0, -44, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[W, -64, 0], [W, -44, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[ARCH.x0, -64, 0], [ARCH.x0, -44, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[ARCH.x1, -64, 0], [ARCH.x1, -44, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[-54, 0, 0], [-54, D, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[-64, 0, 0], [-44, 0, 0]], group: "plan", color: C.orange, width: 1.4 },
  { pts: [[-64, D, 0], [-44, D, 0]], group: "plan", color: C.orange, width: 1.4 },
  {
    pts: Array.from({ length: 10 }, (_, i): V3 => {
      const a = (i / 9) * (Math.PI / 2);
      return [82 + 90 * Math.sin(a), D - 90 * Math.cos(a), 0];
    }),
    group: "plan",
    color: C.charcoal,
    width: 0.9,
    dash: "4 4",
  },
  { pts: [[82, D, 0], [82, D - 90, 0]], group: "plan", color: C.charcoal, width: 1.2 },
];

const STAGES = ["Plan", "Layout", "Volume", "Material", "Space"] as const;
const BOUNDS = [0, 0.24, 0.4, 0.7, 0.86, 1.01];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const r = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

export default function PlanToSpace({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const faces = useRef<(SVGPathElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const glow = useRef<SVGEllipseElement>(null);
  const shade = useRef<SVGPathElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const labels = useRef<(SVGTextElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState(0);
  const lastStage = useRef(-1);

  const labelDefs = useMemo(
    () => [
      { at: [190, 175, 0] as V3, text: "Living" },
      { at: [126, D + 46, 0] as V3, text: "Entry" },
      { at: [335, -78, 0] as V3, text: "opening" },
    ],
    []
  );

  useEffect(() => {
    const render = (p: number) => {
      const t = ease(r(p, 0.4, 0.58));
      const eW = ease(r(p, 0.52, 0.68));
      const eF = ease(r(p, 0.58, 0.72));
      const drawW = r(p, 0.03, 0.2);
      const drawF = r(p, 0.22, 0.36);
      const dims = r(p, 0.12, 0.22) * (1 - r(p, 0.38, 0.46));
      const m = r(p, 0.7, 0.84);
      const L = r(p, 0.84, 0.97);
      const S = 1.32 + (1.2 - 1.32) * t;
      const cx = 520;
      const cy = 390 + 84 * t;
      const th = (Math.PI / 4) * t;
      const sy = 1 - 0.42265 * t;
      const cos = Math.cos(th);
      const sin = Math.sin(th);

      const P = ([x, y, z]: V3, e: number) => {
        const u = x - W / 2;
        const v = y - D / 2;
        const ru = u * cos - v * sin;
        const rv = u * sin + v * cos;
        return [cx + ru * S, cy + rv * sy * S - z * e * t * S];
      };
      const path = (pts: V3[], e: number, close = true) =>
        pts.map((q, i) => {
          const [a, b] = P(q, e);
          return `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`;
        }).join("") + (close ? "Z" : "");
      const ext = (g: Group | string) => (g === "wall" ? eW : g === "furn" || g === "cut" ? (g === "cut" ? eW : eF) : 1);

      FACES.forEach((f, i) => {
        const el = faces.current[i];
        if (!el) return;
        el.setAttribute("d", path(f.pts, ext(f.group)));
        let fill: string;
        let fo = 1;
        if (f.poche) fill = f.group === "cut" ? C.charcoal : mix(mix(C.charcoal, f.model, t), f.mat, m);
        else fill = mix(f.model, f.mat, m);
        if (f.group === "furn") fo = f.top ? r(t, 0.15, 0.6) : clamp(eF * 3);
        if (f.group === "wall" && !f.top) fo = clamp(eW * 3);
        if (f.group === "cut" && !f.top) fo = clamp(eW * 3);
        if (f.appear === "lintel") fo = clamp(eW * 3);
        if (f.group === "floor") fo = 0.25 + 0.75 * Math.max(t, m);
        el.style.fill = fill;
        el.style.fillOpacity = String(fo);
        const drawP = f.draw === "wall" ? drawW : f.draw === "furn" ? drawF : 1;
        el.style.strokeDashoffset = String(1 - drawP);
        el.style.strokeOpacity = String((f.draw ? Math.min(1, drawP * 4) : clamp(t * 2)) * (1 - 0.45 * m));
      });

      LINES.forEach((l, i) => {
        const el = lines.current[i];
        if (!el) return;
        const e = l.group === "detail" || l.group === "late" ? eW : 1;
        el.setAttribute("d", path(l.pts, e, false));
        let o = 1;
        if (l.group === "plan") o = dims;
        else if (l.group === "floor") o = 0.25 * drawW * (1 - t) + 0.45 * m;
        else if (l.group === "detail" || l.group === "late") o = m;
        else if (l.group === "plant") {
          o = r(p, 0.8, 0.9);
          el.style.strokeDashoffset = String(1 - r(p, 0.8, 0.96));
        }
        el.style.opacity = String(o);
      });

      labelDefs.forEach((lab, i) => {
        const el = labels.current[i];
        if (!el) return;
        const [a, b] = P(lab.at, 0);
        el.setAttribute("x", a.toFixed(1));
        el.setAttribute("y", b.toFixed(1));
        el.style.opacity = String(r(p, 0.14, 0.24) * (1 - r(p, 0.36, 0.44)));
      });

      if (glow.current) {
        const [gx, gy] = P([178, 160, 0], 0);
        glow.current.setAttribute("cx", gx.toFixed(1));
        glow.current.setAttribute("cy", gy.toFixed(1));
        glow.current.setAttribute("rx", String(170 * S));
        glow.current.setAttribute("ry", String(170 * S * sy));
        glow.current.style.opacity = String(L);
      }
      if (shade.current) {
        // pendant shade: small cone in 3D
        const top: V3 = [178, 160, 136];
        const pts: V3[] = [[164, 160, 118], [192, 160, 118], top];
        shade.current.setAttribute("d", path(pts, eW));
        shade.current.style.opacity = String(m);
        shade.current.style.fill = mix(C.charcoal, C.orange, L);
      }
      if (sheet.current) sheet.current.style.backgroundColor = mix("#e1dccf", "#ecd3bb", L * 0.85);

      const s = Math.max(0, BOUNDS.findIndex((b, i) => p >= b && p < BOUNDS[i + 1]));
      if (s !== lastStage.current) {
        lastStage.current = s;
        setStage(s);
      }
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };

    const state = { p: motionOK() ? 0 : 1 };
    render(state.p);
    if (!motionOK()) return;
    const el = root.current!;
    const tween = gsap.to(state, {
      p: 1,
      ease: "none",
      onUpdate: () => render(state.p),
      scrollTrigger: { trigger: el.querySelector(".pts-track"), start: "top top", end: "bottom bottom", scrub: 0.8 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [labelDefs]);

  useGSAP(
    () => {
      // Section entry: the drafting grid sweeps across the sheet.
      if (!motionOK()) return;
      gsap.fromTo(
        root.current!.querySelector(".pts-sheet"),
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.6 } }
      );
    },
    { scope: root }
  );

  const renderFaces = (idx: number[]) =>
    idx.map((i) => {
      const f = FACES[i];
      return (
        <path
          key={`f${i}`}
          ref={(el) => {
            faces.current[i] = el;
          }}
          pathLength={f.draw ? 1 : undefined}
          strokeDasharray={f.draw ? "1" : undefined}
          className="pts-face"
        />
      );
    });
  const renderLines = (keep: (l: Line) => boolean) =>
    LINES.map((l, i) =>
      keep(l) ? (
        <path
          key={`l${i}`}
          ref={(el) => {
            lines.current[i] = el;
          }}
          className="pts-line"
          stroke={l.color ?? "#252622"}
          strokeWidth={l.width ?? 0.8}
          strokeDasharray={l.group === "plant" ? "1" : l.dash}
          pathLength={l.group === "plant" ? 1 : undefined}
        />
      ) : null
    );

  return (
    <section ref={root} className="pts" aria-labelledby="pts-title" data-section="From plan to space">
      <div className="pts-track">
        <div className="pts-stick grid-12">
          <div className="pts-copy col-span-6 md:col-span-4">
            <RevealText as={headingLevel} id="pts-title" className="t-xl" text={approach.title} />
            <ol className="pts-list" aria-label="Stages">
              {STAGES.map((s, i) => (
                <li key={s} className={i === stage ? "is-on" : i < stage ? "is-past" : ""} aria-current={i === stage ? "step" : undefined}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pts-stage">{s}</span>
                </li>
              ))}
            </ol>
            <div className="pts-progress" aria-hidden="true">
              <span ref={bar} />
            </div>
          </div>

          <div ref={sheet} className="pts-sheet col-span-6 md:col-start-5 md:col-span-8">
            <svg ref={svg} viewBox="0 0 1040 760" className="pts-svg" role="img" aria-label="An animated drawing: a floor plan is drawn, furnished, raised into a three-dimensional room, then finished with materials and light.">
              <defs>
                <radialGradient id="pts-glow">
                  <stop offset="0%" stopColor="#f2b27a" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#c36d38" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#c36d38" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="pts-scene">
                {renderFaces([0])}
                {renderLines((l) => l.group === "floor")}
                <ellipse ref={glow} fill="url(#pts-glow)" />
                {renderFaces(FACES.map((_, i) => i).filter((i) => i > 0 && FACES[i].group === "wall" || FACES[i].group === "furn" && i === 1))}
                {renderLines((l) => l.group === "detail")}
                {renderFaces(FACES.map((_, i) => i).filter((i) => i > 1 && (FACES[i].group === "furn" || FACES[i].group === "cut")))}
                {renderLines((l) => l.group === "late" || l.group === "plant" || l.group === "plan")}
                <path ref={shade} className="pts-shade" />
                {labelDefs.map((lab, i) => (
                  <text
                    key={lab.text}
                    ref={(el) => {
                      labels.current[i] = el;
                    }}
                    className="pts-label"
                    textAnchor="middle"
                  >
                    {lab.text}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
