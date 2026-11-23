"use client";

import { useEffect, useRef } from "react";

/** CAD-style crosshair with a coordinate readout; grows into a label over [data-cursor]. Fine pointers only. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100,
      y = -100,
      rx = x,
      ry = y,
      raf = 0;
    const guides = document.querySelector<HTMLElement>("[data-guides]");
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (read.current) read.current.textContent = `${String(Math.round(x)).padStart(4, "0")} , ${String(Math.round(y)).padStart(4, "0")}`;
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      ring.current?.classList.toggle("is-label", !!t);
      if (label.current) label.current.textContent = t?.dataset.cursor ?? "";
      const link = (e.target as HTMLElement).closest("a,button");
      ring.current?.classList.toggle("is-link", !!link && !t);
      if (guides) {
        const r = guides.getBoundingClientRect();
        guides.style.setProperty("--gx", `${x - r.left}px`);
        guides.style.setProperty("--gy", `${y - r.top}px`);
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => root.classList.add("cursor-out");
    const enter = () => root.classList.remove("cursor-out");
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dot} className="cursor-dot">
        <span ref={read} className="cursor-read" />
      </div>
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
    </div>
  );
}
