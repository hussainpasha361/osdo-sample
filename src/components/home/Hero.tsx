"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";
import { hero } from "@/content/hero";
import ConstructedWordmark, { MORPH } from "@/components/brand/ConstructedWordmark";
import HeroTools from "./HeroTools";
import DrawingPhoto, { type DrawingPhotoHandle } from "./DrawingPhoto";
import { site } from "@/content/site";

/**
 * Signature: line drawings registered to photographs of the studio.
 * - Load: the first drawing traces itself; drafting tools work on the sheet.
 * - Pointer: a lens reveals the photograph through any drawing.
 * - Scroll: the first photograph opens, its frame settles into a row of four,
 *   and the three new panes arrive as drawings that each open in turn.
 * Every image stays at or below its source resolution.
 * The Drawing/Photograph toggle offers the same to keyboard, touch and
 * reduced-motion visitors.
 */

type Rect = { left: number; top: number; width: number; height: number };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const lead = useRef<DrawingPhotoHandle>(null);
  const panes = useRef<(DrawingPhotoHandle | null)[]>([]);
  const guides = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<"drawing" | "photo">("drawing");
  const [desktop, setDesktop] = useState(false);
  const [guideRect, setGuideRect] = useState<{ vw: number; vh: number; f: Rect } | null>(null);
  const d = hero.drawing;

  const startRect = useCallback((): Rect => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const navH = vw < 900 ? 64 : 72;
    const margin = Math.min(Math.max(20, vw * 0.034), 56);
    if (vw < 900) {
      // Phone: a full-width frame between the name and the wordmark.
      const full = vw - margin * 2;
      const wordH = (full * 270) / 960;
      const top = navH + 92;
      const bottom = vh - wordH - 40 - 56;
      let width = full;
      let height = Math.min(width / (d.width / d.height), bottom - top);
      width = Math.min(full, height * (d.width / d.height));
      height = width / (d.width / d.height);
      return { left: (vw - width) / 2, top, width, height: Math.min(height, bottom - top) };
    }
    const height = vh - navH - 116;
    const width = Math.min((height * d.width) / d.height, vw * 0.38);
    return { left: vw - margin - width, top: navH + 60, width, height };
  }, [d.width, d.height]);

  /** Final state: four panes (a row on desktop, a 2×2 grid on phones); the lead frame becomes the last. */
  const paneRect = useCallback((i: number): Rect => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const margin = Math.min(Math.max(20, vw * 0.034), 56);
    if (vw < 900) {
      const gap = 8;
      const top = 64 + 12;
      const w = (vw - margin * 2 - gap) / 2;
      const h = (vh - top - 58 - gap) / 2;
      return { left: margin + (i % 2) * (w + gap), top: top + Math.floor(i / 2) * (h + gap), width: w, height: h };
    }
    const gap = Math.min(Math.max(10, vw * 0.012), 20);
    const top = (vw < 900 ? 64 : 72) + 22;
    const w = (vw - margin * 2 - gap * 3) / 4;
    return { left: margin + i * (w + gap), top, width: w, height: vh - top - 46 };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Place the lead frame and compute guide positions (desktop).
  useEffect(() => {
    const place = () => {
      const r = startRect();
      const el = frame.current;
      if (el && (window.scrollY || 0) < 4) gsap.set(el, r);
      setGuideRect(desktop ? { vw: document.documentElement.clientWidth, vh: window.innerHeight, f: r } : null);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [desktop, startRect]);

  useEffect(() => {
    if (!guideRect || !guides.current) return;
    const g = guides.current.querySelectorAll("[data-g]");
    if (!motionOK()) {
      gsap.set(g, { opacity: 1 });
      return;
    }
    gsap.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.06, delay: 0.3, overwrite: true });
  }, [guideRect]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const ok = motionOK();
      const leadEl = el.querySelector(".hero-frame")!;
      if (ok) {
        // Wait for the loading screen on a first visit.
        const waiting = document.documentElement.classList.contains("is-loading");
        const tl = gsap.timeline({ delay: 0.15, paused: waiting });
        if (waiting) window.addEventListener("osdo:loaded", () => tl.play(), { once: true });
        tl.fromTo(el.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.2)
          .fromTo(leadEl.querySelectorAll('.hero-ink--paper [data-layer="lines"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: { amount: 0.7 } }, 0.25)
          .fromTo(leadEl.querySelectorAll('.hero-ink--paper [data-layer="soft"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", stagger: { amount: 0.9 } }, 0.9)
          .fromTo(leadEl.querySelectorAll(".hero-note"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, 1.6)
          .add(() => leadEl.querySelector(".hero-ink--paper")?.classList.remove("draw--pending"));
      } else {
        el.querySelectorAll(".hero-ink--paper").forEach((n) => n.classList.remove("draw--pending"));
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        const f = frame.current!;
        const word = el.querySelector<HTMLElement>(".hero-word")!;
        const wsvg = word.querySelector("svg")!;
        const letter = (i: number) => wsvg.querySelector(`.fw-morph[data-letter="${i}"]`)!;
        const strokesOf = (...ids: number[]) => ids.flatMap((i) => Array.from(letter(i).querySelectorAll(".fw-stroke")));
        // Where the finished mark docks: the logo mark in the navigation bar.
        const dock = () => {
          const mark = document.querySelector(".nav-mark")?.getBoundingClientRect();
          const k = word.offsetWidth / 960;
          if (!mark) return { x: 0, y: 0, s: 1 };
          const sc = mark.height / (MORPH.bbox.h * k);
          return { x: mark.left - word.offsetLeft - MORPH.bbox.x * k * sc, y: mark.top - word.offsetTop - MORPH.bbox.y * k * sc, s: sc };
        };
        const paneEls = gsap.utils.toArray<HTMLElement>(".hero-pane", el);
        const placePanes = () =>
          gsap.set(paneEls, {
            left: (i: number) => paneRect(i).left,
            top: (i: number) => paneRect(i).top,
            width: (i: number) => paneRect(i).width,
            height: (i: number) => paneRect(i).height,
          });
        placePanes();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: ok ? 0.6 : true,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              const p = s.progress;
              word.classList.toggle("is-morphing", p > 0.004);
              lead.current?.setScroll(gsap.utils.clamp(0, 1, p / 0.26));
              panes.current.forEach((h, i) => h?.setScroll(gsap.utils.clamp(0, 1, (p - (0.5 + i * 0.05)) / 0.12)));
            },
          },
        });
        tl.to(el.querySelectorAll(".hero-guides-wrap, .hero-cue"), { opacity: 0, duration: 0.1 }, 0)
          // OSDO becomes the mark: S and first O retract, D turns into the arch, O settles on top.
          .to(strokesOf(0, 1), { strokeDashoffset: 1, duration: 0.08, ease: "power2.in" }, 0.02)
          .to([letter(0), letter(1)], { opacity: 0, duration: 0.05 }, 0.06)
          .to(wsvg.querySelectorAll(".fw-guide, .fw-node"), { opacity: 0, duration: 0.06 }, 0.02)
          .to(letter(2), { rotation: -90, scaleX: MORPH.archScale, svgOrigin: `${MORPH.cx} ${MORPH.cy}`, duration: 0.1, ease: "power3.inOut" }, 0.05)
          .to(letter(3), { x: MORPH.oDx, y: MORPH.oDy, scale: MORPH.ring, svgOrigin: `${MORPH.oCx} ${MORPH.cy}`, duration: 0.11, ease: "power3.inOut" }, 0.06)
          // The mark takes its two colours as it forms: orange arch, charcoal ring.
          .to(strokesOf(2), { stroke: "#c36d38", duration: 0.08 }, 0.06)
          .to(strokesOf(3), { stroke: "#252622", duration: 0.08 }, 0.06)
          .fromTo(wsvg.querySelector(".fw-lock"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.025, ease: "back.out(3)" }, 0.165)
          // ...then docks into the navigation bar.
          .set(word, { zIndex: 120, transformOrigin: "0 0" }, 0.19)
          .to(word, { x: () => dock().x, y: () => dock().y, scale: () => dock().s, duration: 0.11, ease: "power3.inOut" }, 0.19)
          .to(wsvg.querySelector(".fw-lock"), { opacity: 0, duration: 0.03 }, 0.25)
          .to(word, { opacity: 0, duration: 0.025 }, 0.295)
          .fromTo(".nav-mark", { scale: 1 }, { scale: 1.3, duration: 0.02, ease: "power2.out", yoyo: true, repeat: 1 }, 0.29)
          .to(f, { outlineColor: "rgba(195,109,56,0)", outlineOffset: 0, duration: 0.16 }, 0.18)
          .to(el.querySelector(".hero-ident"), { opacity: 0, y: -24, duration: 0.14 }, 0.2)
          .to(el.querySelector(".hero-tools"), { opacity: 0, duration: 0.05 }, 0)
          .to(f, { left: () => paneRect(3).left, top: () => paneRect(3).top, width: () => paneRect(3).width, height: () => paneRect(3).height, ease: "power2.inOut", duration: 0.22 }, 0.24)
          .fromTo(el.querySelector(".hero-steel"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.3)
          .fromTo(paneEls, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.14, stagger: 0.04, ease: "power3.out" }, 0.33)
          .fromTo(
            paneEls.map((p) => p.querySelectorAll(".hero-ink--paper [data-stroke]")),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.12, stagger: { amount: 0.06 }, ease: "power1.inOut" },
            0.35
          )
          .fromTo(paneEls.map((p) => p.querySelectorAll(".hero-note")), { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: { amount: 0.05 } }, 0.44)
          .fromTo(el.querySelector(".hero-panes-cap"), { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.46)
          .to(el.querySelector(".hero-toggle-wrap"), { bottom: 9, duration: 0.12, ease: "power2.inOut" }, 0.3)
          .to({}, { duration: 0.05 }, 0.95);

        (window as unknown as { __heroTl?: gsap.core.Timeline }).__heroTl = tl;
        // Ivory navigation over the black backdrop.
        const nav = document.querySelector<HTMLElement>(".nav");
        const st = ScrollTrigger.create({
          trigger: el,
          start: () => `top+=${(el.offsetHeight - window.innerHeight) * 0.33} top`,
          end: "bottom top+=36",
          invalidateOnRefresh: true,
          onToggle: (s) => {
            if (!nav) return;
            if (s.isActive) nav.dataset.tone = "ivory";
            else if (nav.dataset.tone === "ivory") delete nav.dataset.tone;
          },
        });

        window.addEventListener("resize", placePanes);
        return () => {
          st.kill();
          window.removeEventListener("resize", placePanes);
          lead.current?.setScroll(0);
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paneRect] }
  );

  const toggle = (m: "drawing" | "photo") => {
    setMode(m);
    lead.current?.setToggled(m === "photo");
    panes.current.forEach((h) => h?.setToggled(m === "photo"));
  };

  // Guides: grid bubbles above the lead frame and datum lines to its left.
  let guideEls: React.ReactNode = null;
  if (guideRect && d.grid) {
    const { f } = guideRect;
    const s = Math.max(f.width / d.width, f.height / d.height);
    const ox = f.left + (f.width - d.width * s) / 2;
    const oy = f.top + (f.height - d.height * s) / 2;
    guideEls = d.grid.map((g) => {
      if (g.axis === "x") {
        const x = ox + g.at * s;
        if (x < f.left - 1 || x > f.left + f.width + 1) return null;
        return (
          <g key={g.label} data-g>
            <line x1={x} x2={x} y1={f.top - 2} y2={f.top - 26} />
            <circle cx={x} cy={f.top - 38} r={11} />
            <text x={x} y={f.top - 34} textAnchor="middle">
              {g.label}
            </text>
          </g>
        );
      }
      // Horizontal datums are left out here: they would cross the drafting tools.
      return null;
    });
  }

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title" data-section="Home">
      <div className="hero-stick">
        <div className="hero-sheet" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="hero-guides-wrap" aria-hidden="true">
          {guideRect ? (
            <svg ref={guides} className="hero-guides" viewBox={`0 0 ${guideRect.vw} ${guideRect.vh}`}>
              {guideEls}
            </svg>
          ) : null}
        </div>

        <HeroTools />

        <div className="hero-ident" data-hero-fade>
          <h1 id="hero-title" className="t-m">
            {site.nameLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="t-small mt-2 hero-ident-sub">{site.descriptor}</p>
        </div>

        <p className="hero-cue t-small" aria-hidden="true" data-hero-fade>
          <span />
          Scroll to open the drawing
        </p>

        <div className="hero-steel" aria-hidden="true" />
        {hero.panes.map((pane, i) => (
          <div key={pane.photo.src} className="hero-pane" style={{ position: "absolute" }}>
            <DrawingPhoto
              ref={(h) => {
                panes.current[i] = h;
              }}
              photo={pane.photo}
              drawing={pane.drawing}
              sizes="25vw"
            />
          </div>
        ))}
        <p className="hero-panes-cap t-note" aria-hidden="true">
          Inside the studio, drawn and photographed
        </p>

        <div ref={frame} className="hero-frame">
          <DrawingPhoto ref={lead} photo={hero.photo} drawing={d} sizes="(min-width: 900px) 44vw, 100vw" priority />
        </div>
        <div className="hero-toggle-wrap" data-hero-fade>
          <div className="hero-toggle" role="group" aria-label="Hero view">
            <button type="button" aria-pressed={mode === "drawing"} onClick={() => toggle("drawing")}>
              Drawing
            </button>
            <button type="button" aria-pressed={mode === "photo"} onClick={() => toggle("photo")}>
              Photograph
            </button>
          </div>
        </div>

        <div className="hero-word">
          <ConstructedWordmark tone="dark" drawOn="load" delay={0.35} label="OSDO" />
        </div>
      </div>
    </section>
  );
}
