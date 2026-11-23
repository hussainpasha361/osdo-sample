"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * All page motion, driven by data attributes:
 *   data-intro="title|sub|nav|mark|rule|plate"  cover-sheet entrance
 *   data-reveal="lines|up|fade"                 one-time scroll reveals
 *   data-rule                                   hairlines that draw across
 *   data-draw                                   drawings whose strokes draw in
 *   data-scrub-words                            statement words brighten with scroll
 *   data-expand                                 reel opens to full bleed
 *   data-hscroll / -track / -bar                pinned horizontal gallery (desktop)
 *   data-progress-line                          process line fills with scroll
 *   data-theme="dark"                           nav inverts over dark sections
 *   data-magnetic                               elements lean toward the pointer
 * Nothing is hidden unless <html> has `motion` (set before paint).
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const motion = root.classList.contains("motion");
    root.classList.add("motion-ready");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let lenis: Lenis | null = null;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id === "#top" || id === "#main" ? null : document.querySelector<HTMLElement>(id);
      if (id !== "#top" && !target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target ?? 0, { offset: 0, duration: 1.6 });
      else (target ?? document.body).scrollIntoView({ behavior: motion ? "smooth" : "auto" });
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    if (!motion) {
      root.classList.add("loaded");
      return () => document.removeEventListener("click", onClick);
    }

    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ smoothWheel: true, lerp: 0.11 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis!.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const cleanups: (() => void)[] = [];
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const q = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(s));

      /* ---------- Cover-sheet entrance ---------- */
      const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      intro
        .fromTo(".hero-title .ln-i", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.5, stagger: 0.1 }, 0)
        .fromTo(".hm-l", { y: 0, yPercent: 105 }, { yPercent: 0, duration: 1.6, stagger: 0.07 }, 0.1)
        .fromTo(".dim", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.2)
        .fromTo('[data-intro="plate"]', { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0.15)
        .fromTo('[data-intro="sub"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: "power2.out" }, 0.6)
        .fromTo('[data-intro="nav"]', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: "power2.out" }, 0.7);

      /* ---------- Loader ---------- */
      const loader = document.querySelector<HTMLElement>(".loader");
      if (loader) {
        lenis!.stop();
        const pct = loader.querySelector<HTMLElement>("[data-loader-pct]");
        const c = { v: 0 };
        // Wait for webfonts (capped) rather than the full load event, so the cover never stalls.
        let ready = false;
        document.fonts?.ready.then(() => (ready = true));
        const lt = gsap.timeline();
        lt.to(".loader-cross", { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut" }, 0)
          .to(".loader-circle", { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.2)
          .to(c, {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (pct) pct.textContent = String(Math.round(c.v)).padStart(3, "0");
            },
          }, 0)
          .add(() => {
            const go = () => {
              gsap
                .timeline()
                .to(".loader-inner", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
                .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.1")
                .add(() => intro.play(), "-=0.6")
                .add(() => {
                  loader.style.display = "none";
                  root.classList.add("loaded");
                  lenis!.start();
                  ScrollTrigger.refresh();
                });
            };
            let done = false;
            const once = () => { if (!done) { done = true; go(); } };
            if (ready) once();
            else {
              document.fonts?.ready.then(once);
              window.setTimeout(once, 700);
            }
          });
      } else {
        root.classList.add("loaded");
        intro.play();
      }

      /* ---------- Hero: wordmark lags behind scroll, plate drifts ---------- */
      gsap.to(".hero-mark", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-plate .plate", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

      /* ---------- One-time reveals ---------- */
      q('[data-reveal="lines"]').forEach((el) => {
        gsap.fromTo(q(".ln-i", el), { y: 0, yPercent: 110 }, {
          yPercent: 0, duration: 1.3, stagger: 0.09, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      ScrollTrigger.batch('[data-reveal="up"]', {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, ease: "power3.out" }),
      });
      ScrollTrigger.batch('[data-reveal="fade"]', {
        start: "top 94%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.05 }),
      });
      q("[data-rule]").forEach((el) =>
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 94%", once: true } })
      );

      /* ---------- Drawings draw themselves in ---------- */
      q("[data-draw]").forEach((el) => {
        const strokes = q<HTMLElement>("svg *:not(g)", el);
        gsap.fromTo(strokes, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", stagger: { amount: 0.8 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => {
            el.classList.add("is-drawn");
            gsap.set(strokes, { clearProps: "strokeDashoffset" });
          },
        });
      });

      /* ---------- Statement: words brighten with scroll ---------- */
      q("[data-scrub-words]").forEach((el) => {
        gsap.fromTo(q(".w", el), { opacity: 0.14 }, {
          opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        });
      });

      /* ---------- Reel opens to full bleed ---------- */
      const reel = document.querySelector<HTMLElement>("[data-expand]");
      if (reel) {
        const frame = reel.querySelector(".reel-frame");
        gsap.fromTo(frame, { clipPath: "inset(18% 22% 18% 22%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: reel, start: "top top", end: "60% bottom", scrub: true },
        });
        gsap.fromTo(reel.querySelector(".plate svg"), { scale: 1.35 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: reel, start: "top top", end: "bottom bottom", scrub: true },
        });
      }

      /* ---------- Featured: pinned horizontal run on wide screens ---------- */
      mm.add("(min-width: 900px)", () => {
        const sec = document.querySelector<HTMLElement>("[data-hscroll]");
        const track = sec?.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!sec || !track) return;
        const dist = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: sec.querySelector(".featured-stick"),
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set("[data-hscroll-bar]", { scaleX: s.progress }),
          },
        });
      });

      /* ---------- Process line ---------- */
      q("[data-progress-line] span").forEach((el) =>
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top 85%", end: "top 35%", scrub: true } })
      );

      /* ---------- Nav: hide on the way down, invert over dark sheets ---------- */
      const nav = document.querySelector<HTMLElement>("[data-nav]");
      if (nav) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (s) => {
            const y = s.scroll();
            nav.classList.toggle("is-scrolled", y > 40);
            nav.classList.toggle("is-hidden", s.direction === 1 && y > window.innerHeight * 0.8 && !root.classList.contains("menu-open"));
          },
        });
        q('[data-theme="dark"]').forEach((sec) =>
          ScrollTrigger.create({ trigger: sec, start: "top 40px", end: "bottom 40px", onToggle: (s) => nav.classList.toggle("on-dark", s.isActive) })
        );
      }

      /* ---------- Magnetic ---------- */
      if (fine) {
        q("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
          };
          const leave = () => { xTo(0); yTo(0); };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
        });
      }
    });

    const onResize = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onResize);

    return () => {
      document.removeEventListener("click", onClick);
      cleanups.forEach((f) => f());
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
