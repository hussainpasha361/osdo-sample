"use client";

import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { gsap, motionOK } from "@/lib/gsap";
import type { Drawing, ImageMedia } from "@/content/types";

/**
 * A photograph with a line drawing registered on top. The photograph shows
 * through a circular lens: under the pointer (hover), from scroll (setScroll)
 * or all at once (setToggled). Notes annotate the drawing. Used for every
 * pane of the hero.
 */

export type DrawingPhotoHandle = {
  setScroll: (p: number) => void;
  setToggled: (on: boolean) => void;
  el: () => HTMLDivElement | null;
};

function Ink({ d, className }: { d: Drawing; className: string }) {
  return (
    <svg className={`hero-ink draw ${className}`} viewBox={`0 0 ${d.width} ${d.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g data-layer="hidden" strokeWidth={1.8} strokeDasharray="8 8" className="hero-hidden">
        {d.hidden?.map((p, i) => <path key={i} d={p} />)}
      </g>
      <g data-layer="lines" strokeWidth={2.2}>
        {d.lines.map((p, i) => (
          <path key={i} d={p} pathLength={1} data-stroke />
        ))}
      </g>
      <g data-layer="soft" strokeWidth={1.6} opacity={0.75}>
        {d.soft?.map((p, i) => (
          <path key={i} d={p} pathLength={1} data-stroke />
        ))}
      </g>
    </svg>
  );
}

const DrawingPhoto = forwardRef<
  DrawingPhotoHandle,
  { photo: ImageMedia; drawing: Drawing; sizes: string; priority?: boolean; pending?: boolean; className?: string }
>(function DrawingPhoto({ photo, drawing: d, sizes, priority = false, pending = true, className = "" }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const photoInk = useRef<SVGSVGElement>(null);
  const notes = useRef<SVGSVGElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  // mode: null follows scroll; "photo"/"drawing" is the visitor's choice from the toggle,
  // which overrides scroll. forceK is that choice's reveal (0 drawing, 1 photo), tweened.
  const L = useRef({ x: 0.5, y: 0.45, hoverR: 0, scrollP: 0, mode: null as null | "photo" | "drawing", forceK: 0 });
  const forceTween = useRef<gsap.core.Tween | null>(null);
  // Cached size (kept by a ResizeObserver) so scroll frames never read layout.
  const size = useRef({ w: 0, h: 0 });
  // Phones: the photograph fades in rather than opening through a lens; cheaper to draw.
  const fade = useRef(false);
  const els = useRef<{ photo: HTMLElement | null; paper: SVGSVGElement | null; scan: SVGSVGElement | null } | null>(null);
  const was = useRef<{ open?: boolean; scan?: boolean; covered?: boolean }>({});

  const getEls = () => {
    const el = root.current;
    if (!el) return null;
    if (!els.current)
      els.current = {
        photo: el.querySelector<HTMLElement>(".hero-photo"),
        paper: el.querySelector<SVGSVGElement>(".hero-ink--paper"),
        scan: el.querySelector<SVGSVGElement>(".hero-ink--scan"),
      };
    return els.current;
  };

  // Keep annotations inside the visible crop: hide notes that fall outside it
  // and set each label on whichever side has room. Runs on resize only.
  const layoutNotes = useCallback(() => {
    const { w, h } = size.current;
    if (!notes.current || w <= 0) return;
    const k = Math.max(w / d.width, h / d.height);
    const x0 = (0 - (w - d.width * k) / 2) / k;
    const x1 = (w - (w - d.width * k) / 2) / k;
    notes.current.querySelectorAll<SVGGElement>("[data-nx]").forEach((g) => {
      const nx = Number(g.dataset.nx);
      const inside = nx > x0 + 24 && nx < x1 - 24;
      g.style.display = inside ? "" : "none";
      const left = nx > (x0 + x1) / 2;
      const line = g.querySelector("line")!;
      const text = g.querySelector("text")!;
      line.setAttribute("x1", String(left ? -9 : 9));
      line.setAttribute("x2", String(left ? -34 : 34));
      text.setAttribute("x", String(left ? -40 : 40));
      text.setAttribute("text-anchor", left ? "end" : "start");
    });
  }, [d.width, d.height]);

  const paint = useCallback(() => {
    const el = root.current;
    const e = getEls();
    if (!el || !e) return;
    if (!size.current.w) size.current = { w: el.offsetWidth, h: el.offsetHeight };
    const { w, h } = size.current;
    const s = L.current;
    const prev = was.current;
    const maxR = Math.hypot(w, h);
    const hoverK = maxR ? Math.min(1, s.hoverR / maxR) : 0;
    const base = s.mode ? s.forceK : s.scrollP;
    const reveal = Math.max(base, hoverK);
    const open = base > 0.9;
    // Once the photograph is open, its linework settles back to a trace.
    if (open !== prev.open) {
      el.classList.toggle("is-open", open);
      prev.open = open;
    }
    const trace = 1 - 0.72 * Math.max(base, reveal > 0.95 ? 1 : 0);
    let covered: boolean;
    if (fade.current) {
      if (e.photo) {
        e.photo.style.clipPath = "none";
        e.photo.style.opacity = String(reveal);
      }
      if (photoInk.current) {
        photoInk.current.style.clipPath = "none";
        photoInk.current.style.opacity = String(reveal * trace);
      }
      covered = reveal >= 0.999;
    } else {
      const r = Math.max(s.hoverR, base * maxR);
      const clip = `circle(${r.toFixed(1)}px at ${(s.x * w).toFixed(1)}px ${(s.y * h).toFixed(1)}px)`;
      if (e.photo) {
        e.photo.style.clipPath = clip;
        e.photo.style.opacity = "";
      }
      if (photoInk.current) {
        photoInk.current.style.clipPath = clip;
        photoInk.current.style.opacity = String(trace);
      }
      covered = r >= maxR - 0.5;
    }
    // The paper drawing is fully hidden under an open photograph: stop painting it.
    if (e.paper && covered !== prev.covered) {
      e.paper.style.visibility = covered ? "hidden" : "";
      prev.covered = covered;
    }
    // The scan layer (bright linework under the lens) only exists while a lens is out.
    const scanning = open && s.hoverR > 0.5 && !fade.current;
    if (e.scan) {
      if (scanning) e.scan.style.clipPath = `circle(${s.hoverR.toFixed(1)}px at ${(s.x * w).toFixed(1)}px ${(s.y * h).toFixed(1)}px)`;
      if (scanning !== prev.scan) {
        e.scan.style.display = scanning ? "" : "none";
        prev.scan = scanning;
      }
    }
    if (ring.current && s.hoverR > 0) {
      const rr = Math.min(s.hoverR, 400);
      ring.current.style.width = ring.current.style.height = `${rr * 2}px`;
      ring.current.style.transform = `translate(${s.x * w - rr}px, ${s.y * h - rr}px)`;
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setScroll: (p: number) => {
        L.current.scrollP = p;
        paint();
      },
      setToggled: (on: boolean) => {
        const s = L.current;
        const el = root.current;
        if (!el) return;
        el.classList.toggle("is-photo", on);
        // Start from what is on screen now, so the change never jumps.
        const from = s.mode ? s.forceK : s.scrollP;
        s.mode = on ? "photo" : "drawing";
        s.x = 0.5;
        s.y = 0.5;
        forceTween.current?.kill();
        if (!motionOK()) {
          s.forceK = on ? 1 : 0;
          paint();
          return;
        }
        const o = { v: from };
        forceTween.current = gsap.to(o, {
          v: on ? 1 : 0,
          duration: 1.1,
          ease: "expo.inOut",
          onUpdate: () => {
            s.forceK = o.v;
            paint();
          },
        });
      },
      el: () => root.current,
    }),
    [paint]
  );

  // Pointer lens (hover on fine pointers, tap elsewhere).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 899px)");
    const setFade = () => {
      fade.current = mq.matches;
      paint();
    };
    mq.addEventListener("change", setFade);
    const ro = new ResizeObserver(([entry]) => {
      const b = entry.contentRect;
      size.current = { w: b.width, h: b.height };
      layoutNotes();
      paint();
    });
    ro.observe(el);
    fade.current = mq.matches;
    paint();
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
          L.current.hoverR = r.v;
          paint();
        },
      });
    };
    const pos = (e: { clientX: number; clientY: number }) => {
      last.current = { x: e.clientX, y: e.clientY };
      const b = el.getBoundingClientRect();
      L.current.x = (e.clientX - b.left) / b.width;
      L.current.y = (e.clientY - b.top) / b.height;
      if (read.current) {
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
    // The pane can move under a still pointer (scroll, resize): keep the lens on the pointer.
    const follow = () => {
      if (el.classList.contains("has-lens") && last.current) pos({ clientX: last.current.x, clientY: last.current.y });
    };
    const enter = (e: PointerEvent) => {
      el.classList.add("has-lens");
      pos(e);
      setR(Math.min(150, el.offsetWidth * 0.3));
    };
    const leave = () => {
      el.classList.remove("has-lens");
      setR(0, 0.5);
    };
    const tap = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || fade.current) return;
      pos(e);
      setR(Math.min(120, el.offsetWidth * 0.32));
      window.setTimeout(() => setR(0, 0.8), 1600);
    };
    window.addEventListener("scroll", follow, { passive: true });
    gsap.ticker.add(follow);
    if (fine) {
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", pos);
      el.addEventListener("pointerleave", leave);
    } else el.addEventListener("pointerdown", tap);
    return () => {
      tween?.kill();
      ro.disconnect();
      mq.removeEventListener("change", setFade);
      window.removeEventListener("scroll", follow);
      gsap.ticker.remove(follow);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", pos);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", tap);
    };
  }, [paint, layoutNotes, d.width, d.height]);

  return (
    <div ref={root} className={`dp ${className}`}>
      <Ink d={d} className={`hero-ink--paper ${pending ? "draw--pending" : ""}`} />
      <Image className="hero-photo" src={photo.src} alt={photo.alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover", objectPosition: photo.focus ?? "50% 50%" }} />
      <svg ref={photoInk} className="hero-ink hero-ink--photo" viewBox={`0 0 ${d.width} ${d.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g strokeWidth={2.2}>
          {d.lines.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g strokeWidth={1.6} opacity={0.75}>
          {d.soft?.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
      </svg>
      <svg className="hero-ink hero-ink--scan" viewBox={`0 0 ${d.width} ${d.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g strokeWidth={2.4}>
          {d.lines.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g strokeWidth={1.8}>
          {d.soft?.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
      </svg>
      <svg ref={notes} className="hero-ink" viewBox={`0 0 ${d.width} ${d.height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ pointerEvents: "none" }}>
        {d.notes?.map((n) => {
          const left = n.x > d.width * 0.7;
          return (
            <g key={n.label} className="hero-note" data-nx={n.x} transform={`translate(${n.x} ${n.y})`}>
              <circle r={7} fill="var(--color-orange)" stroke="none" />
              <line x1={left ? -9 : 9} y1={0} x2={left ? -34 : 34} y2={0} stroke="var(--color-orange)" strokeWidth={1.5} />
              <text x={left ? -40 : 40} y={7} textAnchor={left ? "end" : "start"} fill="var(--color-orange-ink)" stroke="none" className="hero-note-txt">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div ref={ring} className="hero-lens-ring" aria-hidden="true" />
      <span ref={read} className="hero-lens-read t-note" aria-hidden="true" />
    </div>
  );
});

export default DrawingPhoto;
