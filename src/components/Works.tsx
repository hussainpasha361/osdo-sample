"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Plate from "./Plate";
import { Sheet, Lines, Arrow } from "./ui";
import { projects } from "@/data/projects";

const filters = ["All", "Residential", "Commercial", "Interiors", "Hospitality", "Landscape"] as const;

/** Project index: filterable rows, with a drawing that trails the pointer on hover. */
export default function Works() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.type === filter)), [filter]);

  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      cx = x,
      cy = y,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      const tilt = Math.max(-8, Math.min(8, (x - cx) * 0.05));
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="works wrap" id="work" aria-labelledby="w-title">
      <Sheet code="A-100" title="Selected work" count={String(projects.length).padStart(2, "0")} />
      <div className="works-head">
        <Lines as="h2" className="h-xl" lines={["An index of", <>houses, rooms <em>&amp; ground.</em></>]} />
        <div className="chips" role="group" aria-label="Filter projects by type">
          {filters.map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="index" role="table" aria-label="Projects" onPointerLeave={() => setActive(null)}>
        <div className="index-row index-row--head" role="row">
          <span role="columnheader">No.</span>
          <span role="columnheader">Project</span>
          <span role="columnheader">Location</span>
          <span role="columnheader">Type</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Year</span>
        </div>
        {list.map((p) => {
          const idx = projects.indexOf(p);
          return (
            <a
              key={p.no}
              href="#work"
              role="row"
              className={`index-row ${active === idx ? "is-active" : ""}`}
              onPointerEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              onBlur={() => setActive(null)}
              data-cursor="Open"
            >
              <span role="cell" className="ix-no">{p.no}</span>
              <span role="cell" className="ix-title">
                <span className="ix-title-i">{p.title}</span>
                <Arrow className="ix-arrow" />
              </span>
              <span role="cell">{p.place}</span>
              <span role="cell">{p.type}</span>
              <span role="cell">
                <i className={`status status--${p.status.replace(" ", "").toLowerCase()}`} aria-hidden="true" />
                {p.status}
              </span>
              <span role="cell">{p.year}</span>
              <span className="ix-thumb" aria-hidden="true">
                <Plate kind={p.plate} tone={p.tone} draw={false} />
              </span>
            </a>
          );
        })}
      </div>

      <div ref={preview} className={`preview ${active !== null ? "is-on" : ""}`} aria-hidden="true">
        {projects.map((p, i) => (
          <div key={p.no} className={`preview-item ${active === i ? "is-on" : ""}`}>
            <Plate kind={p.plate} tone={p.tone} draw={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
