"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { RevealText } from "@/components/motion/Reveal";
import { films } from "@/content/films";
import { site } from "@/content/site";

/**
 * On film: OSDO's reels in a dark screening room.
 * - Entry: two ivory panels part like doors as the section arrives.
 * - The active reel is larger and plays; its own footage glows behind the
 *   room. Hover previews a reel, click or Enter selects it and toggles sound.
 * - Only one film plays at a time, and nothing plays while off screen.
 */
export default function Films() {
  const root = useRef<HTMLElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const ambient = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);
  const playable = films.map((f) => !!f.src);

  // Doors part on entry; the room scales up slightly as it settles.
  useGSAP(
    () => {
      const el = root.current!;
      if (!motionOK()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: 0.6 } });
      tl.fromTo(el.querySelector(".films-door--l"), { xPercent: 0 }, { xPercent: -101, ease: "power2.inOut" }, 0)
        .fromTo(el.querySelector(".films-door--r"), { xPercent: 0 }, { xPercent: 101, ease: "power2.inOut" }, 0)
        .fromTo(el.querySelector(".films-seam"), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.8)
        .fromTo(el.querySelector(".films-stage"), { scale: 0.92 }, { scale: 1, ease: "power2.out" }, 0);
    },
    { scope: root }
  );

  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play only the active film (and its ambient copy) while the section is visible.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView && !reduce) {
        if (!v.src && films[i].src) v.src = films[i].src!;
        v.muted = muted;
        v.play().catch(() => {});
      } else v.pause();
    });
    const a = ambient.current;
    const f = films[active];
    if (a && f.src) {
      if (a.dataset.src !== f.src) {
        a.src = f.src;
        a.dataset.src = f.src;
      }
      if (inView && !reduce) a.play().catch(() => {});
      else a.pause();
    }
  }, [active, inView, muted]);

  // Progress line for the active film.
  useEffect(() => {
    const v = vids.current[active];
    if (!v) return;
    const tick = () => {
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, [active]);

  const choose = (i: number) => {
    if (!playable[i]) return;
    if (i === active) setMuted((m) => !m);
    else {
      setActive(i);
    }
  };

  const current = films[active];

  return (
    <section ref={root} className="films" aria-labelledby="films-title" data-nav-tone="ivory" data-section="On film">
      <video ref={ambient} className="films-ambient" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      {current.poster ? <div className="films-glow" style={{ backgroundImage: `url(${current.poster})` }} aria-hidden="true" /> : null}
      <div className="films-door films-door--l" aria-hidden="true" />
      <div className="films-door films-door--r" aria-hidden="true" />
      <span className="films-seam" aria-hidden="true" />

      <div className="films-stage grid-12">
        <div className="films-copy col-span-6 md:col-span-4">
          <RevealText as="h2" id="films-title" className="t-xxl" text={["On", "film"]} />
          <p className="t-small mt-6 text-ivory/70 max-w-[30ch]">
            Reels from the studio&apos;s{" "}
            <a href={site.instagram.url} target="_blank" rel="noreferrer" className="u-line u-line--on text-ivory">
              Instagram
            </a>
            .
          </p>
          <div className="films-now">
            <p className="t-note text-ivory/60">Now showing</p>
            <p className="t-m mt-2">{current.title}</p>
            <div className="films-progress" aria-hidden="true">
              <span ref={bar} />
            </div>
            <button type="button" className="films-sound" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} disabled={!current.src}>
              <span className="films-sound-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        </div>

        <ul className="films-reel col-span-6 md:col-start-6 md:col-span-7" aria-label="Films">
          {films.map((f, i) => (
            <li key={f.id} className={`film ${i === active ? "is-active" : ""} ${f.src ? "" : "is-empty"}`}>
              <button
                type="button"
                className="film-card"
                onClick={() => choose(i)}
                onMouseEnter={() => f.src && setActive(i)}
                aria-pressed={i === active}
                aria-label={f.src ? `${f.title}${i === active ? (muted ? ", select to turn sound on" : ", select to turn sound off") : ", play"}` : `${f.title}, not yet available`}
                data-cursor={f.src ? (i === active ? (muted ? "Sound on" : "Sound off") : "Play film") : undefined}
              >
                <span className="film-frame">
                  {f.src ? (
                    <video
                      ref={(v) => {
                        vids.current[i] = v;
                      }}
                      poster={f.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label={f.alt}
                    />
                  ) : (
                    <span className="film-empty t-note">
                      Reel {String(i + 1).padStart(2, "0")}
                      <br />
                      Footage to come
                    </span>
                  )}
                </span>
                <span className="film-cap">
                  <span className="num t-note">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-small">{f.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
