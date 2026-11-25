"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/**
 * "OSDO" built from the same geometry as the mark: circles, arcs and one
 * straight stem, shown with its construction guides. Draws itself when it
 * scrolls into view; static under reduced motion.
 */
const W = 960;
const H = 270;
const TOP = 34;
const BASE = 236;
const MID = (TOP + BASE) / 2;
const R = (BASE - TOP) / 2; // 101
const SW = 34;

const O1 = { cx: 116, cy: MID };
const S = { x: 372 };
const D = { x: 540 };
const O2 = { cx: 842, cy: MID };

const sTop = R * 0.52;
const strokes = [
  `M${O1.cx - R + SW / 2} ${MID}a${R - SW / 2} ${R - SW / 2} 0 1 0 ${2 * (R - SW / 2)} 0a${R - SW / 2} ${R - SW / 2} 0 1 0 ${-2 * (R - SW / 2)} 0`,
  // S: two stacked arcs
  `M${S.x + sTop * 0.94} ${TOP + SW / 2 + sTop * 0.62}A${sTop} ${sTop} 0 1 0 ${S.x} ${MID}A${sTop} ${sTop} 0 1 1 ${S.x - sTop * 0.94} ${BASE - SW / 2 - sTop * 0.62}`,
  // D: stem and bowl
  `M${D.x} ${TOP + SW / 2}V${BASE - SW / 2}`,
  `M${D.x - SW / 2} ${TOP + SW / 2}H${D.x + 40}A${R - SW / 2} ${R - SW / 2} 0 0 1 ${D.x + 40} ${BASE - SW / 2}H${D.x - SW / 2}`,
  `M${O2.cx - R + SW / 2} ${MID}a${R - SW / 2} ${R - SW / 2} 0 1 0 ${2 * (R - SW / 2)} 0a${R - SW / 2} ${R - SW / 2} 0 1 0 ${-2 * (R - SW / 2)} 0`,
];

const guides = [
  `M0 ${TOP}H${W}`,
  `M0 ${BASE}H${W}`,
  `M0 ${MID}H${W}`,
  `M${O1.cx} 0V${H}`,
  `M${S.x} 0V${H}`,
  `M${D.x} 0V${H}`,
  `M${O2.cx} 0V${H}`,
  `M${O1.cx - R} ${MID}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`,
  `M${O2.cx - R} ${MID}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`,
  `M${S.x - sTop} ${TOP + SW / 2 + sTop}a${sTop} ${sTop} 0 1 0 ${2 * sTop} 0a${sTop} ${sTop} 0 1 0 ${-2 * sTop} 0`,
];

const nodes: [number, number][] = [
  [O1.cx, MID],
  [S.x, MID],
  [D.x + 40, MID],
  [O2.cx, MID],
  [D.x, TOP],
  [D.x, BASE],
];

/**
 * Geometry for turning the wordmark into the mark (O resting on a D turned
 * into an arch). Used by the hero's scroll morph.
 */
export const MORPH = (() => {
  const left = D.x - SW / 2;
  const right = D.x + 40 + R;
  const cx = (left + right) / 2; // centre of the D's outer box
  const dWidth = right - left; // D's horizontal extent (becomes the arch's height)
  const archScale = 0.71; // flattens the bowl to the mark's proportions
  const archTop = MID - (dWidth * archScale) / 2;
  const ring = 0.81; // O to arch width, as in the mark
  const oCy = archTop - R * ring;
  return { cx, cy: MID, archScale, archTop, ring, oCx: O2.cx, oDx: cx - O2.cx, oDy: oCy - MID, bbox: { x: cx - R, y: oCy - R * ring, w: 2 * R, h: MID + (dWidth * archScale) / 2 - (oCy - R * ring) } };
})();

/** Letter index for each stroke, and each letter's centre (for proximity and the click pulse). */
const LETTER_OF_STROKE = [0, 1, 2, 2, 3];
const CENTRES: [number, number][] = [
  [O1.cx, MID],
  [S.x, MID],
  [D.x + 40, MID],
  [O2.cx, MID],
];
/** Shared geometry, used by the loading screen to build the same letters. */
export const GEOM = { W, H, TOP, BASE, MID, R, SW, strokes, guides, nodes, LETTER_OF_STROKE, CENTRES };

const ORANGE = [195, 109, 56];
const BASES = { light: [234, 230, 219], dark: [89, 99, 68] };
const tint = (base: number[], k: number) => `rgb(${base.map((v, i) => Math.round(v + (ORANGE[i] - v) * k)).join(",")})`;

/**
 * tone "light": ivory strokes (footer, on olive). tone "dark": olive strokes on ivory (hero).
 * drawOn "load" draws immediately (hero); "scroll" waits until it enters view.
 */
export default function ConstructedWordmark({
  className = "",
  tone = "light",
  drawOn = "scroll",
  delay = 0,
  label = "OSDO",
}: {
  className?: string;
  tone?: "light" | "dark";
  drawOn?: "load" | "scroll";
  delay?: number;
  label?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const base = BASES[tone];
  const drawn = useRef(false);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || !motionOK()) {
        svg?.classList.remove("draw--pending");
        drawn.current = true;
        return;
      }
      const waiting = drawOn === "load" && document.documentElement.classList.contains("is-loading");
      const tl = gsap.timeline({
        ...(drawOn === "scroll" ? { scrollTrigger: { trigger: svg, start: "top 85%", once: true } } : { delay, paused: waiting }),
        onComplete: () => {
          svg.classList.remove("draw--pending");
          drawn.current = true;
        },
      });
      tl.fromTo(svg.querySelectorAll(".fw-guide"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.04, ease: "power2.inOut" })
        .fromTo(svg.querySelectorAll(".fw-node"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(2)" }, 0.5)
        .fromTo(svg.querySelectorAll(".fw-stroke"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: "expo.inOut" }, 0.6);
      if (waiting) window.addEventListener("osdo:loaded", () => tl.play(), { once: true });
    },
    { scope: ref }
  );

  // Interaction: the cursor becomes a compass point. Rays run from every
  // construction node to it; letters lean towards it and warm to orange.
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const letters = Array.from(svg.querySelectorAll<SVGGElement>(".fw-letter"));
    const rays = Array.from(svg.querySelectorAll<SVGLineElement>(".fw-ray"));
    const cross = svg.querySelector<SVGGElement>(".fw-cross")!;
    const read = svg.querySelector<SVGTextElement>(".fw-read")!;
    const moving = motionOK();
    const movers = letters.map((g) => ({
      x: gsap.quickTo(g, "x", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(g, "y", { duration: 0.6, ease: "power3.out" }),
      r: gsap.quickTo(g, "rotation", { duration: 0.8, ease: "power3.out" }),
    }));
    letters.forEach((g, i) => gsap.set(g, { svgOrigin: `${CENTRES[i][0]} ${CENTRES[i][1]}` }));

    const toLocal = (e: PointerEvent) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      return pt.matrixTransform(svg.getScreenCTM()!.inverse());
    };
    const move = (e: PointerEvent) => {
      if (!drawn.current) return;
      if (svg.closest(".is-morphing")) {
        leave();
        return;
      }
      const p = toLocal(e);
      svg.classList.add("is-live");
      cross.setAttribute("transform", `translate(${p.x} ${p.y})`);
      read.setAttribute("x", String(p.x + 14));
      read.setAttribute("y", String(p.y - 12));
      read.textContent = `x ${String(Math.round(p.x)).padStart(4, "0")}  y ${String(Math.round(p.y)).padStart(4, "0")}`;
      rays.forEach((ray, i) => {
        const [nx, ny] = nodes[i];
        ray.setAttribute("x1", String(nx));
        ray.setAttribute("y1", String(ny));
        ray.setAttribute("x2", String(p.x));
        ray.setAttribute("y2", String(p.y));
        const d = Math.hypot(p.x - nx, p.y - ny);
        ray.style.opacity = String(Math.max(0.12, 1 - d / 520));
      });
      letters.forEach((g, i) => {
        const [cx, cy] = CENTRES[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const k = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
        g.querySelectorAll<SVGPathElement>(".fw-stroke").forEach((s) => (s.style.stroke = tint(base, k)));
        if (moving) {
          movers[i].x(dx * 0.08 * k);
          movers[i].y(dy * 0.08 * k);
          movers[i].r((dx / 240) * 8 * k);
        }
      });
    };
    const leave = () => {
      svg.classList.remove("is-live");
      // While the hero morph owns the letters, leave their colours alone.
      const morphing = !!svg.closest(".is-morphing");
      letters.forEach((g, i) => {
        if (!morphing) g.querySelectorAll<SVGPathElement>(".fw-stroke").forEach((s) => (s.style.stroke = ""));
        if (moving) {
          movers[i].x(0);
          movers[i].y(0);
          movers[i].r(0);
        }
      });
    };
    const click = (e: PointerEvent) => {
      if (!drawn.current) return;
      const p = toLocal(e);
      let best = 0;
      let bd = Infinity;
      CENTRES.forEach(([cx, cy], i) => {
        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      if (bd > 160) return;
      const g = letters[best];
      const pulse = svg.querySelectorAll<SVGCircleElement>(".fw-pulse")[best];
      if (moving) {
        gsap.fromTo(g.querySelectorAll(".fw-stroke"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "expo.inOut", overwrite: true });
        gsap.fromTo(pulse, { attr: { r: 20 }, opacity: 0.9 }, { attr: { r: 150 }, opacity: 0, duration: 1.1, ease: "power2.out" });
      }
      if (e.pointerType !== "mouse") window.setTimeout(leave, 1400);
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", leave);
    svg.addEventListener("pointerdown", click);
    return () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerleave", leave);
      svg.removeEventListener("pointerdown", click);
    };
  }, [base]);

  return (
    <svg ref={ref} className={`footer-word footer-word--${tone} draw--pending ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {guides.map((d, i) => (
        <path key={`g${i}`} className="fw-guide" d={d} pathLength={1} data-stroke />
      ))}
      <g className="fw-rays" aria-hidden="true">
        {nodes.map((_, i) => (
          <line key={`r${i}`} className="fw-ray" />
        ))}
      </g>
      {CENTRES.map(([x, y], i) => (
        <circle key={`p${i}`} className="fw-pulse" cx={x} cy={y} r={20} opacity={0} />
      ))}
      {CENTRES.map((_, li) => (
        <g key={`L${li}`} className="fw-morph" data-letter={li}>
          <g className="fw-letter">
            {strokes.map((d, i) =>
              LETTER_OF_STROKE[i] === li ? <path key={`s${i}`} className="fw-stroke" d={d} pathLength={1} strokeWidth={SW} strokeLinecap="butt" data-stroke /> : null
            )}
          </g>
        </g>
      ))}
      <circle className="fw-lock" cx={MORPH.cx} cy={MORPH.archTop} r={7} opacity={0} />
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} className="fw-node" cx={x} cy={y} r={5} />
      ))}
      <g className="fw-cross" aria-hidden="true">
        <circle r={10} />
        <path d="M-22 0H22M0 -22V22" />
      </g>
      <text className="fw-read" aria-hidden="true" />
    </svg>
  );
}
