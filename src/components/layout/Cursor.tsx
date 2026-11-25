"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A small label that follows the pointer over elements with [data-cursor],
 * naming what a click will do ("View project", "Play film"). The system
 * cursor stays visible. Fine pointers only.
 */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const label = t?.dataset.cursor;
      el.current?.classList.toggle("is-on", !!label);
      if (label && tag.current && tag.current.textContent !== label) tag.current.textContent = label;
    };
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    el.current?.classList.remove("is-on");
  }, [pathname]);

  return (
    <div ref={el} className="cursor" aria-hidden="true">
      <span ref={tag} className="cursor-tag" />
    </div>
  );
}
