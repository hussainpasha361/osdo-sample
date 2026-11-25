"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";

/**
 * Drafting instruments working quietly on the hero's sheet:
 * a compass sweeping an arc, a set square ruling vertical lines along a
 * T-square, and a scale rule with a travelling marker. Slow, faint and
 * paused when off screen; static under reduced motion.
 */
const C = { x: 600, y: 360 }; // compass centre
const R = 128;
const LEG = 168;

const polar = (deg: number, r = R) => [C.x + r * Math.cos((deg * Math.PI) / 180), C.y + r * Math.sin((deg * Math.PI) / 180)];
const arcPath = (a0: number, a1: number) => {
  const [x0, y0] = polar(a0);
  const [x1, y1] = polar(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 ${large} ${a1 > a0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

const BLADE_Y = 620;
const RULED = [390, 460, 530, 600, 670, 740];

export default function HeroTools({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current!;
      const arc = svg.querySelector<SVGPathElement>(".ht-arc")!;
      const needle = svg.querySelector<SVGLineElement>(".ht-needle")!;
      const pencil = svg.querySelector<SVGLineElement>(".ht-pencil")!;
      const hinge = svg.querySelector<SVGCircleElement>(".ht-hinge")!;
      const square = svg.querySelector<SVGGElement>(".ht-square")!;
      const ruled = Array.from(svg.querySelectorAll<SVGLineElement>(".ht-ruled"));
      const marker = svg.querySelector<SVGGElement>(".ht-marker")!;

      const START = -200;
      const setCompass = (a: number) => {
        const [px, py] = polar(a);
        const mx = (C.x + px) / 2;
        const my = (C.y + py) / 2;
        const half = R / 2;
        const lift = Math.sqrt(Math.max(0, LEG * LEG - half * half));
        // hinge sits above the chord, on its perpendicular
        const dx = (px - C.x) / R;
        const dy = (py - C.y) / R;
        let nx = dy;
        let ny = -dx;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        const hx = mx + nx * lift;
        const hy = my + ny * lift;
        needle.setAttribute("x1", String(hx));
        needle.setAttribute("y1", String(hy));
        pencil.setAttribute("x1", String(hx));
        pencil.setAttribute("y1", String(hy));
        pencil.setAttribute("x2", String(px));
        pencil.setAttribute("y2", String(py));
        hinge.setAttribute("cx", String(hx));
        hinge.setAttribute("cy", String(hy));
        arc.setAttribute("d", arcPath(START, Math.max(START + 0.5, a)));
      };

      if (!motionOK()) {
        setCompass(-20);
        gsap.set(square, { x: RULED[3] - 60 });
        ruled.forEach((l) => gsap.set(l, { attr: { y1: BLADE_Y - 4 } }));
        return;
      }

      gsap.set(square, { x: RULED[0] - 60 });
      const c = { a: START };
      setCompass(START);
      const compass = gsap
        .timeline({ repeat: -1, repeatDelay: 1.2 })
        .to(c, { a: 20, duration: 7, ease: "sine.inOut", onUpdate: () => setCompass(c.a) })
        .to(arc, { opacity: 0, duration: 1.2, ease: "power1.in" }, "+=1.6")
        .to(c, { a: START, duration: 2.4, ease: "sine.inOut", onUpdate: () => setCompass(c.a) }, "<")
        .set(arc, { opacity: 1 });

      const ruling = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      ruled.forEach((l, i) => {
        ruling
          .to(square, { x: RULED[i] - 60, duration: 1.6, ease: "power2.inOut" })
          .fromTo(l, { attr: { y1: BLADE_Y - 4 } }, { attr: { y1: 380 + (i % 3) * 40 }, duration: 1.1, ease: "power2.out" });
      });
      ruling.to(ruled, { opacity: 0, duration: 1, stagger: 0.05 }, "+=1.5").to(square, { x: RULED[0] - 60, duration: 1.8, ease: "power2.inOut" }, "<").set(ruled, { opacity: 1, attr: { y1: BLADE_Y - 4 } });

      const scale = gsap.to(marker, { x: 360, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });

      const all = [compass, ruling, scale];
      ScrollTrigger.create({
        trigger: svg.closest("section") ?? svg,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => all.forEach((t) => (s.isActive ? t.play() : t.pause())),
      });
    },
    { scope: ref }
  );

  return (
    <svg ref={ref} className={`hero-tools ${className}`} viewBox="0 0 860 900" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
      {/* scale rule */}
      <g className="ht-rule" transform="translate(410 150)">
        <rect x="0" y="0" width="400" height="26" />
        {Array.from({ length: 41 }, (_, i) => (
          <line key={i} x1={i * 10} x2={i * 10} y1={0} y2={i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <text key={i} x={i * 100 + 3} y={23}>
            {i}
          </text>
        ))}
        <text x={412} y={18}>
          1:50
        </text>
        <g className="ht-marker">
          <path d="M0 -10 L6 -18 H-6 Z" />
          <line x1={0} x2={0} y1={-10} y2={30} />
        </g>
      </g>

      {/* compass */}
      <circle className="ht-centre" cx={C.x} cy={C.y} r={3.5} />
      <path className="ht-guide" d={`M${C.x - R - 24} ${C.y}H${C.x + R + 24}M${C.x} ${C.y - 24}V${C.y + 24}`} />
      <path className="ht-arc" />
      <line className="ht-needle ht-leg" x2={C.x} y2={C.y} />
      <line className="ht-pencil ht-leg" />
      <circle className="ht-hinge" r={7} />

      {/* T-square and set square */}
      <line className="ht-blade" x1={330} x2={830} y1={BLADE_Y} y2={BLADE_Y} />
      <line className="ht-blade ht-blade--edge" x1={330} x2={830} y1={BLADE_Y + 10} y2={BLADE_Y + 10} />
      {RULED.map((x, i) => (
        <line key={i} className="ht-ruled" x1={x} x2={x} y1={BLADE_Y - 4} y2={BLADE_Y - 4} />
      ))}
      <g className="ht-square">
        {/* 30/60 set square with its vertical edge on the left */}
        <path d={`M60 ${BLADE_Y - 2} V${BLADE_Y - 200} L175 ${BLADE_Y - 2} Z`} />
        <path d={`M76 ${BLADE_Y - 20} V${BLADE_Y - 140} L144 ${BLADE_Y - 20} Z`} />
      </g>
    </svg>
  );
}
