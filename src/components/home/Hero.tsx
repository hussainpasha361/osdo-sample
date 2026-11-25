"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";
import { hero } from "@/content/hero";
import { studioPhotos } from "@/content/studio";
import ConstructedWordmark from "@/components/brand/ConstructedWordmark";
import HeroTools from "./HeroTools";
import { site } from "@/content/site";
import type { Drawing } from "@/content/types";

/**
 * Signature: a line drawing registered to a photograph of the same space.
 * - Load: the drawing traces itself (construction first, then structure, then planting).
 * - Pointer: a lens reveals the photograph through the drawing.
 * - Scroll: the lens widens until the photograph fills the screen.
 * The Drawing/Photograph toggle offers the same thing to keyboard, touch and
 * reduced-motion visitors.
 */

function Ink({ d, className, idPrefix }: { d: Drawing; className: string; idPrefix: string }) {
  return (
    <svg className={`hero-ink draw ${className}`} viewBox={`0 0 ${d.width} ${d.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g data-layer="hidden" strokeWidth={1.8} strokeDasharray="8 8" className="hero-hidden">
        {d.hidden?.map((p, i) => <path key={`${idPrefix}h${i}`} d={p} />)}
      </g>
      <g data-layer="lines" strokeWidth={2.2}>
        {d.lines.map((p, i) => (
          <path key={`${idPrefix}l${i}`} d={p} pathLength={1} data-stroke />
        ))}
      </g>
      <g data-layer="soft" strokeWidth={1.6} opacity={0.75}>
        {d.soft?.map((p, i) => (
          <path key={`${idPrefix}s${i}`} d={p} pathLength={1} data-stroke />
        ))}
      </g>
    </svg>
  );
}

type Rect = { left: number; top: number; width: number; height: number };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const guides = useRef<SVGSVGElement>(null);
  const lens = useRef({ x: 0.5, y: 0.45, hoverR: 0, scrollP: 0, toggled: false });
  const [mode, setMode] = useState<"drawing" | "photo">("drawing");
  const [desktop, setDesktop] = useState(false);
  const [guideRect, setGuideRect] = useState<{ vw: number; vh: number; f: Rect } | null>(null);
  const d = hero.drawing;

  /** Writes the lens state to CSS variables. Effective radius is the largest of hover, scroll and toggle. */
  const paint = useCallback(() => {
    const el = frame.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const L = lens.current;
    const maxR = Math.hypot(w, h);
    const r = L.toggled ? maxR : Math.max(L.hoverR, L.scrollP * maxR);
    el.style.setProperty("--lens-x", `${L.x * w}px`);
    el.style.setProperty("--lens-y", `${L.y * h}px`);
    el.style.setProperty("--lens-r", `${r}px`);
    if (ring.current) {
      const rr = Math.min(L.hoverR, 400);
      ring.current.style.width = ring.current.style.height = `${rr * 2}px`;
      ring.current.style.transform = `translate(${L.x * w - rr}px, ${L.y * h - rr}px)`;
    }
  }, []);

  // Initial frame geometry on the desktop composition.
  const startRect = useCallback((): Rect => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const navH = vw < 900 ? 60 : 72;
    const margin = Math.min(Math.max(20, vw * 0.034), 56);
    const height = vh - navH - 96;
    const width = Math.min((height * d.width) / d.height, vw * 0.44);
    return { left: vw - margin - width, top: navH + 60, width, height };
  }, [d.width, d.height]);

  /** Final state: four panes in a steel glazing grid; the drawing frame becomes the last pane. */
  const paneRect = useCallback((i: number): Rect => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const pad = 12;
    const gap = 12;
    const w = (vw - pad * 2 - gap * 3) / 4;
    return { left: pad + i * (w + gap), top: pad, width: w, height: vh - pad * 2 };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Place the frame and compute guide positions (desktop).
  useEffect(() => {
    if (!desktop) {
      setGuideRect(null);
      if (frame.current) frame.current.removeAttribute("style");
      paint();
      return;
    }
    const place = () => {
      const r = startRect();
      const el = frame.current;
      if (el && lens.current.scrollP === 0) gsap.set(el, r);
      setGuideRect({ vw: document.documentElement.clientWidth, vh: window.innerHeight, f: r });
      paint();
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [desktop, startRect, paint]);

  // Guides render after measuring, so they fade in on their own.
  useEffect(() => {
    if (!guideRect || !guides.current) return;
    const g = guides.current.querySelectorAll("[data-g]");
    if (!motionOK()) {
      gsap.set(g, { opacity: 1 });
      return;
    }
    gsap.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.06, delay: 0.3, overwrite: true });
  }, [guideRect]);

  // Intro + scroll choreography.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const ok = motionOK();
      if (ok) {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(el.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.2)
          .fromTo(el.querySelectorAll('.hero-ink--paper [data-layer="lines"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: { amount: 0.7 } }, 0.25)
          .fromTo(el.querySelectorAll('.hero-ink--paper [data-layer="soft"] [data-stroke]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", stagger: { amount: 0.9 } }, 0.9)
          .fromTo(el.querySelectorAll(".hero-note"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, 1.6)
          .add(() => el.querySelector(".hero-ink--paper")?.classList.remove("draw--pending"));
      } else {
        el.querySelector(".hero-ink--paper")?.classList.remove("draw--pending");
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const f = frame.current!;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: ok ? 0.6 : true,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              lens.current.scrollP = gsap.utils.clamp(0, 1, s.progress / 0.45);
              paint();
            },
          },
        });
        const panes = gsap.utils.toArray<HTMLElement>(".hero-pane", el);
        tl.to(f, { left: () => paneRect(3).left, top: () => paneRect(3).top, width: () => paneRect(3).width, height: () => paneRect(3).height, ease: "power2.inOut", duration: 0.5, onUpdate: paint }, 0.35)
          .to(el.querySelectorAll(".hero-guides-wrap, .hero-toggle, .hero-cue"), { opacity: 0, duration: 0.15 }, 0)
          .to(el.querySelectorAll(".hero-note"), { opacity: 0, duration: 0.15 }, 0)
          .to(f, { outlineColor: "rgba(195,109,56,0)", outlineOffset: 0, duration: 0.25 }, 0.3)
          .to(el.querySelectorAll(".hero-ident, .hero-word"), { opacity: 0, y: -24, duration: 0.25, stagger: 0.04 }, 0.32)
          .to(el.querySelector(".hero-tools"), { opacity: 0, duration: 0.3 }, 0.35)
          .to(el.querySelector(".hero-ink--paper"), { opacity: 0, duration: 0.3 }, 0.3)
          .to(el.querySelector(".hero-ink--photo"), { opacity: 0, duration: 0.3 }, 0.45)
          .fromTo(el.querySelector(".hero-steel"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.55)
          .fromTo(panes, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, stagger: 0.07, ease: "power3.out" }, 0.58)
          .fromTo(panes.map((p) => p.querySelector("img")), { scale: 1.2 }, { scale: 1, duration: 0.45, stagger: 0.07, ease: "power2.out" }, 0.58)
          .fromTo(el.querySelector(".hero-transom"), { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power2.inOut" }, 0.82)
          .fromTo(el.querySelectorAll(".hero-pane-cap"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.03 }, 0.88)
          .to({}, { duration: 0.05 });
        const placePanes = () =>
          gsap.set(panes, {
            left: (i: number) => paneRect(i).left,
            top: (i: number) => paneRect(i).top,
            width: (i: number) => paneRect(i).width,
            height: (i: number) => paneRect(i).height,
          });
        placePanes();
        const onResize = placePanes;
        window.addEventListener("resize", onResize);
        // Ivory navigation while the photograph fills the screen.
        const nav = document.querySelector<HTMLElement>(".nav");
        const st = ScrollTrigger.create({
          trigger: el,
          start: () => `top+=${(el.offsetHeight - window.innerHeight) * 0.55} top`,
          end: "bottom top+=36",
          invalidateOnRefresh: true,
          onToggle: (s) => {
            if (!nav) return;
            if (s.isActive) nav.dataset.tone = "ivory";
            else if (nav.dataset.tone === "ivory") delete nav.dataset.tone;
          },
        });
        return () => {
          window.removeEventListener("resize", onResize);
          st.kill();
          lens.current.scrollP = 0;
          paint();
        };
      });
      mm.add("(max-width: 899px)", () => {
        ScrollTrigger.create({
          trigger: frame.current,
          start: "top 5%",
          end: "bottom 40%",
          scrub: true,
          onUpdate: (s) => {
            lens.current.scrollP = s.progress;
            paint();
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paint] }
  );

  // Pointer lens.
  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const r = { v: 0 };
    let tween: gsap.core.Tween | null = null;
    const setR = (to: number, dur = 0.6) => {
      tween?.kill();
      tween = gsap.to(r, {
        v: to,
        duration: motionOK() ? dur : 0,
        ease: "expo.out",
        onUpdate: () => {
          lens.current.hoverR = r.v;
          paint();
        },
      });
    };
    const pos = (e: PointerEvent) => {
      const b = f.getBoundingClientRect();
      lens.current.x = (e.clientX - b.left) / b.width;
      lens.current.y = (e.clientY - b.top) / b.height;
      if (read.current) {
        // Report position in drawing units (photo pixels), like a CAD readout.
        const s = Math.max(b.width / d.width, b.height / d.height);
        const ox = (b.width - d.width * s) / 2;
        const oy = (b.height - d.height * s) / 2;
        const px = Math.round((e.clientX - b.left - ox) / s);
        const py = Math.round((e.clientY - b.top - oy) / s);
        read.current.textContent = `x ${String(px).padStart(4, "0")}  y ${String(py).padStart(4, "0")}`;
        read.current.style.transform = `translate(${e.clientX - b.left + 16}px, ${e.clientY - b.top + 16}px)`;
      }
      paint();
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && fine) return;
      f.classList.add("has-lens");
      pos(e);
      setR(Math.min(150, f.offsetWidth * 0.24));
    };
    const leave = () => {
      f.classList.remove("has-lens");
      setR(0, 0.5);
    };
    const tap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      pos(e);
      setR(Math.min(120, f.offsetWidth * 0.3));
      window.setTimeout(() => setR(0, 0.8), 1600);
    };
    if (fine) {
      f.addEventListener("pointerenter", enter);
      f.addEventListener("pointermove", pos);
      f.addEventListener("pointerleave", leave);
    } else {
      f.addEventListener("pointerdown", tap);
    }
    return () => {
      tween?.kill();
      f.removeEventListener("pointerenter", enter);
      f.removeEventListener("pointermove", pos);
      f.removeEventListener("pointerleave", leave);
      f.removeEventListener("pointerdown", tap);
    };
  }, [paint, d.width, d.height]);

  const toggle = (m: "drawing" | "photo") => {
    setMode(m);
    const L = lens.current;
    if (!motionOK()) {
      L.toggled = m === "photo";
      paint();
      return;
    }
    const f = frame.current!;
    const maxR = Math.hypot(f.offsetWidth, f.offsetHeight);
    const o = { v: m === "photo" ? Math.max(L.hoverR, 0) : maxR };
    L.toggled = false;
    L.x = 0.5;
    L.y = 0.5;
    gsap.to(o, {
      v: m === "photo" ? maxR : 0,
      duration: 1.1,
      ease: "expo.inOut",
      onUpdate: () => {
        L.hoverR = o.v;
        paint();
      },
      onComplete: () => {
        L.toggled = m === "photo";
        L.hoverR = 0;
        paint();
      },
    });
  };

  // Guide geometry: map drawing coordinates to the viewport for the lines that run past the frame.
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

  const s0 = { width: d.width, height: d.height };

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

        {(
          <>
            <div className="hero-steel" aria-hidden="true" />
            {[studioPhotos[1], studioPhotos[2], studioPhotos[3]].map((m, i) =>
              m.kind === "image" ? (
                <figure key={m.src} className="hero-pane" style={{ position: "absolute" }}>
                  <Image src={m.src} alt={m.alt} fill sizes="25vw" style={{ objectFit: "cover", objectPosition: m.focus ?? "50% 50%" }} />
                  <figcaption className="hero-pane-cap t-note">{["Steel and oak", "Fluted wall, olive door", "Planters, timber bench"][i]}</figcaption>
                </figure>
              ) : null
            )}
            <span className="hero-transom" aria-hidden="true" />
          </>
        )}

        <div ref={frame} className={`hero-frame ${mode === "photo" ? "is-photo" : ""}`}>
          <Ink d={d} className="hero-ink--paper draw--pending" idPrefix="p" />
          <Image
            className="hero-photo"
            src={hero.photo.kind === "image" ? hero.photo.src : ""}
            alt={hero.photo.alt}
            fill
            priority
            sizes="(min-width: 900px) 100vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "50% 50%" }}
          />
          <Ink d={d} className="hero-ink--photo" idPrefix="o" />
          <svg className="hero-ink" viewBox={`0 0 ${s0.width} ${s0.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ pointerEvents: "none" }}>
            {d.notes?.map((n) => {
              const left = n.x > d.width * 0.7; // keep labels inside the frame
              return (
                <g key={n.label} className="hero-note" transform={`translate(${n.x} ${n.y})`}>
                  <circle r={7} fill="var(--color-orange)" stroke="none" />
                  <line x1={left ? -9 : 9} y1={0} x2={left ? -34 : 34} y2={0} stroke="var(--color-orange)" strokeWidth={1.5} />
                  <text x={left ? -40 : 40} y={7} textAnchor={left ? "end" : "start"} fill="var(--color-orange-ink)" stroke="none" style={{ font: "21px var(--font-mono)" }}>
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div ref={ring} className="hero-lens-ring" aria-hidden="true" />
          <span ref={read} className="hero-lens-read t-note" aria-hidden="true" />
          <div className="hero-toggle" role="group" aria-label="Hero view" style={{ left: 12, top: 12 }} data-hero-fade>
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
