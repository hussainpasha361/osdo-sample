"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";
import { hero } from "@/content/hero";
import ConstructedWordmark from "@/components/brand/ConstructedWordmark";
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
    const height = vh - navH - 116;
    const width = Math.min((height * d.width) / d.height, vw * 0.44);
    return { left: vw - margin - width, top: navH + 60, width, height };
  }, [d.width, d.height]);

  /** Final state: a row of four panes on the sheet; the lead frame becomes the last. */
  const paneRect = useCallback((i: number): Rect => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const margin = Math.min(Math.max(20, vw * 0.034), 56);
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
    if (!desktop) {
      setGuideRect(null);
      if (frame.current) frame.current.removeAttribute("style");
      return;
    }
    const place = () => {
      const r = startRect();
      const el = frame.current;
      if (el && (window.scrollY || 0) < 4) gsap.set(el, r);
      setGuideRect({ vw: document.documentElement.clientWidth, vh: window.innerHeight, f: r });
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
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(el.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.2)
          .fromTo(leadEl.querySelectorAll('.hero-ink--paper [data-layer="lines"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: { amount: 0.7 } }, 0.25)
          .fromTo(leadEl.querySelectorAll('.hero-ink--paper [data-layer="soft"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", stagger: { amount: 0.9 } }, 0.9)
          .fromTo(leadEl.querySelectorAll(".hero-note"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, 1.6)
          .add(() => leadEl.querySelector(".hero-ink--paper")?.classList.remove("draw--pending"));
      } else {
        el.querySelectorAll(".hero-ink--paper").forEach((n) => n.classList.remove("draw--pending"));
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const f = frame.current!;
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
              lead.current?.setScroll(gsap.utils.clamp(0, 1, p / 0.32));
              panes.current.forEach((h, i) => h?.setScroll(gsap.utils.clamp(0, 1, (p - (0.66 + i * 0.07)) / 0.16)));
            },
          },
        });
        tl.to(el.querySelectorAll(".hero-guides-wrap, .hero-cue"), { opacity: 0, duration: 0.12 }, 0)
          .to(f, { outlineColor: "rgba(195,109,56,0)", outlineOffset: 0, duration: 0.2 }, 0.24)
          .to(el.querySelectorAll(".hero-ident, .hero-word"), { opacity: 0, y: -24, duration: 0.2, stagger: 0.04 }, 0.28)
          .to(el.querySelector(".hero-tools"), { opacity: 0, duration: 0.25 }, 0.3)
          .to(f, { left: () => paneRect(3).left, top: () => paneRect(3).top, width: () => paneRect(3).width, height: () => paneRect(3).height, ease: "power2.inOut", duration: 0.3 }, 0.32)
          .fromTo(paneEls, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, stagger: 0.05, ease: "power3.out" }, 0.46)
          .fromTo(
            paneEls.map((p) => p.querySelectorAll(".hero-ink--paper [data-stroke]")),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.22, stagger: 0.05, ease: "power1.inOut" },
            0.5
          )
          .fromTo(paneEls.map((p) => p.querySelectorAll(".hero-note")), { opacity: 0 }, { opacity: 1, duration: 0.08, stagger: 0.04 }, 0.62)
          .fromTo(el.querySelector(".hero-panes-cap"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.6)
          .to({}, { duration: 0.08 }, 0.95);

        window.addEventListener("resize", placePanes);
        return () => {
          window.removeEventListener("resize", placePanes);
          lead.current?.setScroll(0);
        };
      });
      mm.add("(max-width: 899px)", () => {
        ScrollTrigger.create({
          trigger: frame.current,
          start: "top 5%",
          end: "bottom 40%",
          scrub: true,
          onUpdate: (s) => lead.current?.setScroll(s.progress),
        });
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
      const y = oy + g.at * s;
      if (y < f.top || y > f.top + f.height) return null;
      return (
        <g key={g.label} data-g>
          <line x1={f.left - 150} x2={f.left - 8} y1={y} y2={y} strokeDasharray="2 5" />
          <text x={f.left - 150} y={y - 8}>
            {g.label}
          </text>
        </g>
      );
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
