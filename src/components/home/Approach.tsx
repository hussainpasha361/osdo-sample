"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import Media from "@/components/media/Media";
import { RevealText } from "@/components/motion/Reveal";
import { approach, stages } from "@/content/approach";
import { Link } from "@/components/layout/PageTransition";

/**
 * Process as one continuous frame: each stage wipes over the last as you
 * scroll, sketch to space. Native scroll drives it (sticky, no pinning tricks).
 * On small screens the stages simply stack.
 */
export default function Approach({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = stages.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const layers = gsap.utils.toArray<HTMLElement>(".ap-stage", el).slice(1);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: motionOK() ? 0.5 : true,
            onUpdate: (s) => setActive(Math.min(n - 1, Math.floor(s.progress * n * 0.999))),
          },
        });
        layers.forEach((layer, i) => {
          tl.fromTo(layer, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, i + 0.5);
        });
        tl.fromTo(el.querySelector(".ap-progress span"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: n }, 0);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="ap" aria-labelledby="ap-title" style={{ ["--n" as string]: n }}>
      {/* desktop: sticky sequence */}
      <div className="hidden min-[900px]:block" style={{ height: `${n * 75 + 40}vh` }}>
        <div className="ap-stick grid-12">
          <div className="col-span-4 flex flex-col gap-10 self-center">
            <RevealText as={headingLevel} id="ap-title" className="t-xl" text={approach.title} />
            <ol className="ap-list grid gap-1">
              {stages.map((s, i) => (
                <li key={s.key} className={i === active ? "is-on" : ""} aria-current={i === active ? "step" : undefined}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-l">{s.title}</span>
                </li>
              ))}
            </ol>
            <div className="ap-progress max-w-[260px]" aria-hidden="true">
              <span />
            </div>
            <Link href={`/work/${approach.project.slug}`} className="t-small u-line w-fit text-graphite" data-cursor="View project">
              Shown with {approach.project.title}
            </Link>
          </div>
          <div className="col-span-6 col-start-6 self-center">
            <div className="relative mx-auto overflow-hidden" style={{ aspectRatio: "709 / 728", width: "min(100%, calc(76svh * 0.974))" }}>
              {stages.map((s, i) => (
                <div key={s.key} className="ap-stage" style={i > 0 ? { clipPath: "inset(0% 0% 0% 100%)" } : undefined}>
                  <Media media={s.media} fill sizes="(min-width: 900px) 50vw, 100vw" />
                  <span className="ap-tag t-note">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* small screens: stacked */}
      <div className="min-[900px]:hidden wrap py-[var(--section)]">
        <h2 className="t-xl">{approach.title.join(" ")}</h2>
        <ol className="mt-12 grid gap-12">
          {stages.map((s, i) => (
            <li key={s.key}>
              <Media media={s.media} sizes="100vw" />
              <p className="mt-3 flex items-baseline gap-3">
                <span className="num t-note">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-l">{s.title}</span>
              </p>
            </li>
          ))}
        </ol>
        <Link href={`/work/${approach.project.slug}`} className="t-small u-line mt-8 inline-block text-graphite">
          Shown with {approach.project.title}
        </Link>
      </div>
    </section>
  );
}
