"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import type { Project } from "@/content/types";

const dash = "—";

/** Index mode: the archive as a drawing schedule, with a preview that follows the pointer. */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const prev = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = prev.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      el.style.transform = `translate3d(${cx + 28}px, ${cy - el.offsetHeight / 2}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ix wrap">
      <div className="ix-list" role="list" aria-label="Project index" onPointerLeave={() => setActive(null)}>
        <div className="ix-row ix-row--head t-note" aria-hidden="true">
          <span className="ix-c-num">No.</span>
          <span className="ix-c-title">Project</span>
          <span className="ix-c-cat">Type</span>
          <span className="ix-c-loc">Location</span>
          <span className="ix-c-year">Year</span>
        </div>
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            role="listitem"
            className="ix-row"
            data-cursor="View project"
            onPointerEnter={() => setActive(p.slug)}
            onFocus={() => setActive(p.slug)}
            onBlur={() => setActive(null)}
          >
            <span className="ix-thumb" aria-hidden="true">
              <Media media={p.cover} ratio="4 / 5" sizes="60px" showLabel={false} />
            </span>
            <span className="ix-c-num num t-note">{p.number}</span>
            <span className="ix-c-title t-l">{p.title}</span>
            <span className="ix-c-cat t-small text-graphite">
              {p.category ?? dash}
              {p.status || p.mediaNote ? <span className="block text-orange-ink">{p.status ?? p.mediaNote}</span> : null}
            </span>
            <span className="ix-c-loc t-small text-graphite">{p.location ?? dash}</span>
            <span className="ix-c-year t-note text-graphite">{p.year ?? dash}</span>
          </Link>
        ))}
      </div>
      <div ref={prev} className={`ix-preview ${active ? "is-on" : ""}`} aria-hidden="true">
        <div className="ix-preview-in" style={{ aspectRatio: "4 / 5" }}>
          {projects.map((p) => (
            <div key={p.slug} className={`ix-preview-item ${active === p.slug ? "is-on" : ""}`}>
              <Media media={p.cover} fill sizes="340px" showLabel={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
