"use client";

import { useRef } from "react";
import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import { ClipReveal } from "@/components/motion/Reveal";
import { orientationOf } from "@/content/projects";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import type { Media as M, Project } from "@/content/types";

/**
 * Gallery mode: each project hung as its own composition, set against a
 * coloured architectural plane (orange, olive, timber in turn) that slides in
 * as the composition arrives. The flagship opens the exhibition; the others
 * are arranged by the shape of their cover.
 */

const PLANES = ["orange", "olive", "timber"] as const;

function Marks({ num }: { num: string }) {
  return (
    <>
      <span className="cmark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="cmark-num t-note" aria-hidden="true">
        {num}
      </span>
    </>
  );
}

const tagOf = (m: M) => (m.role === "before" ? "Before" : m.role === "after" ? "After" : undefined);

function Frame({ m, ratio, sizes, num, drift = 3 }: { m: M; ratio?: string; sizes: string; num?: string; drift?: number }) {
  const tag = tagOf(m);
  return (
    <div className="ex-frame">
      <ClipReveal drift={drift}>
        <Media media={m} ratio={ratio} sizes={sizes} />
      </ClipReveal>
      {num ? <Marks num={num} /> : null}
      {tag ? <span className="fig-note t-note block">{tag}</span> : null}
    </div>
  );
}

function Meta({ p, className = "" }: { p: Project; className?: string }) {
  const facts = [p.category, p.location, p.year].filter(Boolean).join(", ");
  const flags = [p.status, p.mediaNote].filter(Boolean).join(". ");
  return (
    <p className={`t-small ${className}`}>
      {facts ? <span className="block text-graphite">{facts}</span> : null}
      {flags ? <span className="block text-orange-ink">{flags}</span> : null}
    </p>
  );
}

function Num({ n }: { n?: string }) {
  return (
    <span className="ex-num" aria-hidden="true">
      {n}
    </span>
  );
}

function Caption({ p }: { p: Project }) {
  return (
    <div className="ex-cap">
      <Num n={p.number} />
      <span className="grid gap-1">
        <span className="t-l ex-title">{p.title}</span>
        <Meta p={p} />
      </span>
    </div>
  );
}

/** Second image for a composition: a "before" if the project has one, otherwise the next photograph. */
function companion(p: Project): M {
  const before = p.transformation?.before.at(-1);
  if (before) return before;
  return p.media.find((m) => m !== p.cover && m.role !== "plan" && m.kind === "image") ?? p.cover;
}

export default function Exhibition({ projects, flagshipSlug }: { projects: Project[]; flagshipSlug?: string }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!motionOK()) return;
      gsap.utils.toArray<HTMLElement>(".ex-plane", root.current).forEach((plane) => {
        gsap.fromTo(
          plane,
          { scaleX: 0 },
          { scaleX: 1, ease: "power2.out", scrollTrigger: { trigger: plane.parentElement, start: "top 85%", end: "top 30%", scrub: 0.8 } }
        );
      });
    },
    { scope: root, dependencies: [projects.length] }
  );

  let uprightTurn = 0;
  return (
    <ol ref={root} className="ex" aria-label="Projects">
      {projects.map((p, i) => {
        const href = `/work/${p.slug}`;
        const label = `View ${p.title}`;
        const second = companion(p);
        const plane = PLANES[i % PLANES.length];

        if (p.slug === flagshipSlug) {
          return (
            <li key={p.slug} className="ex-item ex-flagship grid-12 gap-y-8">
              <span className={`ex-plane ex-plane--${plane} ex-plane--flag`} aria-hidden="true" />
              <Link href={href} className="ex-link col-span-6 md:col-span-7" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} ratio="4 / 5" sizes="(min-width: 768px) 56vw, 100vw" num={p.number} />
              </Link>
              <div className="col-span-6 md:col-start-9 md:col-span-4 flex flex-col gap-10">
                <div>
                  <p className="flex items-end gap-4">
                    <Num n={p.number} />
                    <span className="t-note text-graphite pb-2">Flagship project</span>
                  </p>
                  <Link href={href} className="t-xl mt-4 block ex-flag-title ex-title" tabIndex={-1}>
                    {p.title}
                  </Link>
                  <Meta p={p} className="mt-4" />
                </div>
                <div className="md:mt-auto w-2/3 self-end md:w-full" aria-hidden="true">
                  <Frame m={second} ratio="3 / 4" sizes="(min-width: 768px) 30vw, 60vw" drift={5} />
                </div>
              </div>
            </li>
          );
        }

        if (orientationOf(p.cover) === "landscape") {
          return (
            <li key={p.slug} className="ex-item grid-12 items-end gap-y-6">
              <span className={`ex-plane ex-plane--${plane} ex-plane--land`} aria-hidden="true" />
              <div className="col-span-6 order-2 md:order-1 md:col-span-3 md:pb-2">
                <Num n={p.number} />
                <Link href={href} className="t-xl mt-3 block ex-title" tabIndex={-1}>
                  {p.title}
                </Link>
                <Meta p={p} className="mt-3" />
              </div>
              <Link href={href} className="ex-link col-span-6 order-1 md:order-2 md:col-start-5 md:col-span-8" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} sizes="(min-width: 768px) 66vw, 100vw" num={p.number} />
              </Link>
            </li>
          );
        }

        const v = uprightTurn++ % 2;
        if (v === 0)
          return (
            <li key={p.slug} className="ex-item grid-12 gap-y-6">
              <span className={`ex-plane ex-plane--${plane} ex-plane--up`} aria-hidden="true" />
              <Link href={href} className="ex-link col-span-6 md:col-start-2 md:col-span-5" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} ratio="4 / 5" sizes="(min-width: 768px) 40vw, 100vw" num={p.number} />
                <Caption p={p} />
              </Link>
              <div className="col-span-4 col-start-3 md:col-start-8 md:col-span-4 md:mt-[30%]" aria-hidden="true">
                <Frame m={second} sizes="(min-width: 768px) 32vw, 66vw" drift={5} />
              </div>
            </li>
          );
        return (
          <li key={p.slug} className="ex-item grid-12 gap-y-6">
            <span className={`ex-plane ex-plane--${plane} ex-plane--up2`} aria-hidden="true" />
            <div className="col-span-3 mt-[30%] md:col-span-3 md:col-start-1 md:mt-[22%]" aria-hidden="true">
              <Frame m={second} ratio="4 / 5" sizes="(min-width: 768px) 25vw, 50vw" drift={5} />
            </div>
            <Link href={href} className="ex-link col-span-3 md:col-start-5 md:col-span-5" data-cursor="View project" aria-label={label}>
              <Frame m={p.cover} ratio="4 / 5" sizes="(min-width: 768px) 40vw, 50vw" num={p.number} />
              <Caption p={p} />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
