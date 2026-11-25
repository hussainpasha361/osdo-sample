"use client";

import { useRef } from "react";
import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import { ClipReveal, Parallax, RevealText } from "@/components/motion/Reveal";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { studioFilm, studioPhotos } from "@/content/studio";

const [arch, shelving, door, desk] = studioPhotos;

/**
 * The studio, seen rather than described. You enter through an arch (the
 * shape of the studio's doorway and of the OSDO mark) that opens to the full
 * width as you scroll in. The film sits in an arch backed by orange.
 */
export default function InsideOsdo({ standalone = false }: { standalone?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionOK() || standalone) return;
      gsap.fromTo(
        el,
        { clipPath: "inset(10% 24% 0% 24% round 50vw 50vw 0vw 0vw)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)",
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 10%", scrub: 0.6 },
        }
      );
      gsap.fromTo(el.querySelector(".inside-ring"), { rotate: -40 }, { rotate: 60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className={`inside ${standalone ? "pt-[calc(var(--nav-h)+clamp(48px,8vw,120px))]" : ""}`}
      aria-labelledby="inside-title"
      data-nav-tone="ivory"
      data-section="Inside OSDO"
    >
      <svg className="inside-ring" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="84" />
        <path d="M100 0V30M100 170V200M0 100H30M170 100H200" />
      </svg>

      <div className="grid-12 gap-y-14 relative">
        <div className="col-span-6 md:col-span-4 md:row-span-2 flex flex-col justify-between gap-10">
          <div>
            <RevealText as={standalone ? "h1" : "h2"} id="inside-title" className="t-xxl" text={["Inside", "OSDO"]} />
            <p className="t-m mt-6 max-w-[18ch] text-ivory/80">A look around the studio.</p>
          </div>
          {!standalone ? (
            <Link href="/studio" className="btn-line btn-line--onolive self-start" data-cursor="Enter the studio">
              <span>Visit the studio</span>
            </Link>
          ) : null}
        </div>

        <figure className="col-span-6 md:col-span-4 md:col-start-5 inside-film" data-cursor="Studio film">
          <span className="film-arch-bg" aria-hidden="true" />
          <span className="film-arch-line" aria-hidden="true" />
          <ClipReveal className="arch">
            <Media media={studioFilm} sizes="(min-width: 768px) 33vw, 90vw" />
          </ClipReveal>
          <figcaption className="inside-cap t-note">Studio film, provisional cut</figcaption>
        </figure>

        <figure className="col-span-3 md:col-span-3 md:col-start-10 md:mt-[46%] relative isolate">
          <span className="ex-grid inside-grid" aria-hidden="true" />
          <Parallax speed={6}>
            <ClipReveal drift={3}>
              <Media media={shelving} ratio="4 / 5" sizes="(min-width: 768px) 25vw, 50vw" />
            </ClipReveal>
          </Parallax>
          <figcaption className="inside-cap t-note">steel and oak</figcaption>
        </figure>

        <figure className="col-span-3 md:col-span-3 md:col-start-1 md:-mt-[30%] mt-16 relative">
          <span className="ex-flute inside-flute" aria-hidden="true" />
          <Parallax speed={10}>
            <ClipReveal drift={3}>
              <Media media={door} ratio="3 / 4" sizes="(min-width: 768px) 25vw, 50vw" />
            </ClipReveal>
          </Parallax>
          <figcaption className="inside-cap t-note">fluted wall, olive door</figcaption>
        </figure>

        <figure className="col-span-6 md:col-span-5 md:col-start-6 md:mt-10">
          <ClipReveal drift={3}>
            <Media media={desk} ratio="16 / 10" sizes="(min-width: 768px) 42vw, 100vw" />
          </ClipReveal>
          <figcaption className="inside-cap t-note">planters, timber bench</figcaption>
        </figure>

        {standalone ? (
          <figure className="col-span-6 md:col-span-6 md:col-start-4 mt-10">
            <ClipReveal drift={3}>
              <Media media={arch} ratio="4 / 5" sizes="(min-width: 768px) 50vw, 100vw" />
            </ClipReveal>
            <figcaption className="inside-cap t-note">pantry arch, leaf shadow</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
