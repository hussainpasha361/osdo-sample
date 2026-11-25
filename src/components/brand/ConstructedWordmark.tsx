"use client";

import { useRef } from "react";
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

export default function ConstructedWordmark({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || !motionOK()) {
        svg?.classList.remove("draw--pending");
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 85%", once: true },
        onComplete: () => svg.classList.remove("draw--pending"),
      });
      tl.fromTo(svg.querySelectorAll(".fw-guide"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.04, ease: "power2.inOut" })
        .fromTo(svg.querySelectorAll(".fw-node"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(2)" }, 0.5)
        .fromTo(svg.querySelectorAll(".fw-stroke"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: "expo.inOut" }, 0.6);
    },
    { scope: ref }
  );

  return (
    <svg ref={ref} className={`footer-word draw--pending ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="OSDO">
      {guides.map((d, i) => (
        <path key={`g${i}`} className="fw-guide" d={d} pathLength={1} data-stroke />
      ))}
      {strokes.map((d, i) => (
        <path key={`s${i}`} className="fw-stroke" d={d} pathLength={1} strokeWidth={SW} strokeLinecap="butt" data-stroke />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} className="fw-node" cx={x} cy={y} r={5} />
      ))}
    </svg>
  );
}
