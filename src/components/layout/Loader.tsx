"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { GEOM, MORPH } from "@/components/brand/ConstructedWordmark";

/**
 * First-visit loading screen: OSDO falls into place, then becomes the mark.
 * Guides draw, the four letters drop and settle, S topples away and the first
 * O rolls off, the D tips over into the arch and the last O falls onto it.
 * The sheet then lifts and the hero begins (window event "osdo:loaded").
 * Shown once per session, skippable with a click or key, never under reduced
 * motion (the boot script decides via html.is-loading).
 */
const { W, H, BASE, MID, R, SW, strokes, guides, LETTER_OF_STROKE, CENTRES } = GEOM;
const sR = R * 0.52;
const centreY = MORPH.bbox.y + MORPH.bbox.h / 2;
const SHIFT = { x: W / 2 - MORPH.cx, y: MID - centreY };

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("is-loading")) return;
    window.__lenis?.stop();

    const q = <T extends Element = SVGGElement>(s: string) => el.querySelector<T>(s)!;
    const letter = (i: number) => q(`.ld-letter[data-i="${i}"]`);
    const strokesOf = (i: number) => letter(i).querySelectorAll(".ld-stroke");
    const count = { v: 0 };
    const num = q<HTMLSpanElement>(".ld-count");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("osdo-intro", "1");
      } catch {}
      html.classList.remove("is-loading");
      el.style.display = "none";
      window.__lenis?.start();
    };

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(count, { v: 100, duration: 2.5, ease: "power1.inOut", onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, "0")) }, 0)
      // construction
      .fromTo(el.querySelectorAll(".ld-guide"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.03, ease: "power2.inOut" }, 0)
      .fromTo(el.querySelectorAll(".ld-node"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(3)" }, 0.2);

    // the fall: each letter drops from just above the screen and settles with a small squash
    const svgEl = q<SVGSVGElement>(".ld-svg");
    const k = svgEl.getBoundingClientRect().width / W || 1;
    const top = svgEl.getBoundingClientRect().top;
    const fromY = -(top / k + H + 40);
    [0, 1, 2, 3].forEach((i) => {
      const at = 0.2 + i * 0.09;
      const [cx] = CENTRES[i];
      tl.set(letter(i), { y: fromY, opacity: 1 }, at)
        .to(letter(i), { y: 0, duration: 0.5, ease: "power3.in" }, at)
        .to(letter(i), { scaleY: 0.86, scaleX: 1.06, svgOrigin: `${cx} ${BASE}`, duration: 0.08, ease: "power2.out" }, at + 0.5)
        .to(letter(i), { scaleY: 1, scaleX: 1, svgOrigin: `${cx} ${BASE}`, duration: 0.35, ease: "back.out(3)" }, at + 0.58);
    });

    // S topples, the first O rolls away
    tl.to(letter(1), { rotation: 88, svgOrigin: `${GEOM.CENTRES[1][0] + sR} ${BASE}`, duration: 0.4, ease: "power2.in" }, 1.25)
      .to(letter(1), { y: 520, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.55)
      .to(letter(0), { x: -460, rotation: -260, svgOrigin: `${CENTRES[0][0]} ${MID}`, opacity: 0, duration: 0.65, ease: "power2.in" }, 1.3)
      .to(el.querySelectorAll(".ld-guide, .ld-node"), { opacity: 0, duration: 0.35 }, 1.35)
      // D tips over into the arch; the stage centres the mark
      .to(letter(2), { rotation: -90, scaleX: MORPH.archScale, svgOrigin: `${MORPH.cx} ${MID}`, duration: 0.5, ease: "power3.inOut" }, 1.55)
      .to(q(".ld-stage"), { x: SHIFT.x, y: SHIFT.y, duration: 0.6, ease: "power3.inOut" }, 1.55)
      // the last O lifts, then falls onto the arch
      .to(letter(3), { x: MORPH.oDx, y: MORPH.oDy - 300, scale: MORPH.ring, svgOrigin: `${MORPH.oCx} ${MID}`, duration: 0.45, ease: "power2.out" }, 1.6)
      .to(letter(3), { y: MORPH.oDy, duration: 0.3, ease: "power3.in" }, 2.05)
      .fromTo(letter(2), { scaleY: 1 }, { scaleY: 0.93, svgOrigin: `${MORPH.cx} ${MID}`, duration: 0.07, yoyo: true, repeat: 1 }, 2.35)
      .fromTo(q(".ld-lock"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(4)" }, 2.35)
      .to(strokesOf(2), { stroke: "#c36d38", duration: 0.35 }, 2.4)
      .fromTo(el.querySelectorAll(".ld-caption"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 2.35)
      // exit: the sheet lifts
      .addLabel("exit", 2.95)
      .to(q(".ld-inner"), { scale: 0.94, opacity: 0, duration: 0.45, ease: "power2.in" }, "exit")
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "exit+=0.15")
      .add(() => window.dispatchEvent(new Event("osdo:loaded")), "exit+=0.45")
      .add(finish);

    // Skip on click or key: jump to the exit.
    const skip = () => {
      if (tl.time() < tl.labels.exit) tl.seek("exit");
    };
    el.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    // Never trap the visitor, whatever happens.
    const safety = window.setTimeout(() => {
      window.dispatchEvent(new Event("osdo:loaded"));
      finish();
    }, 7000);

    return () => {
      el.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.clearTimeout(safety);
      tl.kill();
    };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden="true">
      <div className="ld-inner">
        <svg className="ld-svg" viewBox={`0 0 ${W} ${H}`}>
          {guides.map((d, i) => (
            <path key={`g${i}`} className="ld-guide" d={d} pathLength={1} />
          ))}
          {GEOM.nodes.slice(0, 4).map(([x, y], i) => (
            <circle key={`n${i}`} className="ld-node" cx={x} cy={y} r={5} />
          ))}
          <g className="ld-stage">
            {CENTRES.map((_, li) => (
              <g key={li} className="ld-letter" data-i={li}>
                {strokes.map((d, i) =>
                  LETTER_OF_STROKE[i] === li ? <path key={i} className="ld-stroke" d={d} strokeWidth={SW} strokeLinecap="butt" /> : null
                )}
              </g>
            ))}
            <circle className="ld-lock" cx={MORPH.cx} cy={MORPH.archTop} r={8} />
          </g>
        </svg>
        <p className="ld-caption ld-name">Ovais &amp; Shahzad Design Office</p>
      </div>
      <span className="ld-count t-note">000</span>
      <span className="ld-caption ld-meta t-note">Architecture and interior design</span>
      <span className="ld-skip t-note">Tap to skip</span>
    </div>
  );
}
