"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/layout/PageTransition";
import { RevealText } from "@/components/motion/Reveal";
import { ScrollTrigger } from "@/lib/gsap";
import Exhibition from "./Exhibition";
import Threshold from "@/components/motion/Threshold";
import ProjectIndex from "./ProjectIndex";
import type { Project } from "@/content/types";

/**
 * The portfolio, in two complementary views. Category filters only appear
 * once real projects carry categories, so nothing is invented for placeholders.
 */
export default function CompletedProjects({
  projects,
  total,
  showAllLink = false,
  headingLevel = "h2",
  id = "completed-projects",
  title = "Completed Projects",
  note,
  flagshipSlug,
  allLabel = "All projects",
  mark = "A",
}: {
  projects: Project[];
  total?: number;
  showAllLink?: boolean;
  headingLevel?: "h1" | "h2";
  id?: string;
  title?: string;
  /** One line under the heading, only where context is needed. */
  note?: string;
  flagshipSlug?: string;
  allLabel?: string;
  /** Grid-bubble letter shown on the section threshold. */
  mark?: string;
}) {
  const [mode, setMode] = useState<"gallery" | "index">("gallery");
  const [filter, setFilter] = useState<string>("All");
  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[];
  const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const count = String(total ?? projects.length).padStart(2, "0");

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => window.clearTimeout(id);
  }, [mode, filter]);

  return (
    <section className="cp" id={id} aria-labelledby={`${id}-title`} data-section={title}>
      <Threshold mark={mark} label={`${count} ${title.toLowerCase()}`} />
      <div className="cp-head grid-12">
        <div className="cp-title">
          <RevealText as={headingLevel} id={`${id}-title`} className="t-xxl" text={title} />
          {note ? <p className="t-small text-graphite mt-5 max-w-[52ch]">{note}</p> : null}
          <span className="t-note num mt-4 block md:hidden">{count} projects</span>
        </div>
        <div className="cp-tools">
          <span className="t-note num hidden md:inline" aria-label={`${count} projects`}>
            ({count})
          </span>
          <div className="modes" role="group" aria-label="View">
            <button type="button" className="mode-btn" aria-pressed={mode === "gallery"} onClick={() => setMode("gallery")}>
              Gallery
            </button>
            <button type="button" className="mode-btn" aria-pressed={mode === "index"} onClick={() => setMode("index")}>
              Index
            </button>
          </div>
        </div>
        {categories.length > 1 && projects.length > 4 ? (
          <div className="col-span-full flex flex-wrap gap-4 pt-2" role="group" aria-label="Filter by type">
            {["All", ...categories].map((c) => (
              <button key={c} type="button" className="mode-btn" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {mode === "gallery" ? <Exhibition projects={list} flagshipSlug={flagshipSlug} /> : <ProjectIndex projects={list} />}

      {showAllLink ? (
        <div className="wrap -mt-[calc(var(--section)*0.5)] pb-[var(--section)]">
          <Link href="/work" className="btn-line" data-cursor="Open archive">
            <span>{allLabel}</span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
