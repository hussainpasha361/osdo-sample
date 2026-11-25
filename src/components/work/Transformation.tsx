"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import Media from "@/components/media/Media";
import { ClipReveal } from "@/components/motion/Reveal";
import { PlanSheet } from "./ProjectBlocks";
import type { Media as M, Project } from "@/content/types";

/**
 * Before-and-after, told in three chapters: the plans side by side, the
 * existing veranda, then the renovated space opening up on olive. Photograph
 * sets are separate and labelled: their camera angles differ, so nothing
 * here implies a matched comparison.
 */

function Chapter({ label, count, tone = "dark" }: { label: string; count: number; tone?: "dark" | "light" }) {
  return (
    <p className={`pj-chapter t-note ${tone === "light" ? "pj-chapter--light" : ""}`}>
      <span className="plan-node" aria-hidden="true" />
      <span>{label}</span>
      <span className="num">({String(count).padStart(2, "0")})</span>
      <span className="pj-chapter-rule" aria-hidden="true" />
    </p>
  );
}

function Photo({ m, className = "", sizes }: { m: M; className?: string; sizes: string }) {
  return (
    <figure className={className}>
      <ClipReveal>
        <Media media={m} sizes={sizes} />
      </ClipReveal>
      <figcaption className="fig-note t-note">{m.label}</figcaption>
    </figure>
  );
}

export default function Transformation({ project }: { project: Project }) {
  const t = project.transformation!;
  const after = useRef<HTMLDivElement>(null);
  const [a1, a2, a3, a4, a5] = t.after;

  useGSAP(
    () => {
      const el = after.current;
      if (!el || !motionOK()) return;
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 5% 0% 5%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true } }
      );
    },
    { scope: after }
  );

  return (
    <div className="tf">
      {project.summary ? (
        <div className="grid-12 py-[clamp(24px,5vw,88px)]">
          <p className="col-span-6 md:col-start-4 md:col-span-6 t-m">{project.summary}</p>
        </div>
      ) : null}

      <section aria-label="Plans">
        <div className="grid-12 pb-6">
          <div className="col-span-full">
            <Chapter label="Plans" count={t.plans.length} />
          </div>
        </div>
        <PlanSheet plans={t.plans} />
      </section>

      <section className="tf-before" aria-label="Before">
        <div className="grid-12 pb-8">
          <div className="col-span-full">
            <Chapter label="Before" count={t.before.length} />
          </div>
        </div>
        <div className="tf-strip">
          {t.before.map((m) => (
            <Photo key={m.label} m={m} className="tf-strip-item" sizes="(min-width: 768px) 30vw, 78vw" />
          ))}
        </div>
      </section>

      <div ref={after} className="tf-after" data-nav-tone="ivory">
        <section aria-label="After" className="grid-12 gap-y-8">
          <div className="col-span-full pb-4">
            <Chapter label="After" count={t.after.length} tone="light" />
          </div>
          {a1 ? <Photo m={a1} className="col-span-6 md:col-span-5" sizes="(min-width: 768px) 40vw, 100vw" /> : null}
          {a2 ? <Photo m={a2} className="col-span-5 col-start-2 md:col-start-7 md:col-span-6 md:mt-[22%]" sizes="(min-width: 768px) 48vw, 85vw" /> : null}
          {a3 ? <Photo m={a3} className="col-span-3 md:col-span-4" sizes="(min-width: 768px) 32vw, 50vw" /> : null}
          {a4 ? <Photo m={a4} className="col-span-3 mt-[24%] md:col-span-4 md:mt-[14%]" sizes="(min-width: 768px) 32vw, 50vw" /> : null}
          {a5 ? <Photo m={a5} className="col-span-4 col-start-2 md:col-start-auto md:col-span-4 md:mt-[4%]" sizes="(min-width: 768px) 32vw, 66vw" /> : null}
          {t.after.slice(5).map((m) => (
            <Photo key={m.label} m={m} className="col-span-6 md:col-span-4" sizes="(min-width: 768px) 32vw, 100vw" />
          ))}
        </section>
      </div>
    </div>
  );
}
