"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Words rise out of masks once, when the text first enters view. Used only on
 * a few key headings, not on every element.
 */
export function RevealText({
  as: T = "h2",
  text,
  className = "",
  delay = 0,
  start = "top 88%",
  id,
}: {
  as?: Tag;
  text: string | string[];
  className?: string;
  delay?: number;
  start?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const lines = Array.isArray(text) ? text : [text];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!motionOK()) {
        el.classList.add("rv--done");
        return;
      }
      gsap.fromTo(
        el.querySelectorAll(".rv-i"),
        { y: 0, yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.045,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => el.classList.add("rv--done"),
        }
      );
    },
    { scope: ref }
  );

  const Comp = T as React.ElementType;
  return (
    <Comp ref={ref} id={id} className={`rv ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((w, wi) => (
            <span key={wi} className="rv-w">
              <span className="rv-i">{w}</span>
              {wi < line.split(" ").length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </Comp>
  );
}

/**
 * Media opens from a soft aperture while fading in, the image settling from a
 * slight zoom. With `drift`, the image then glides inside its frame as you scroll.
 */
export function ClipReveal({ children, className = "", delay = 0, drift = 0 }: { children: React.ReactNode; className?: string; delay?: number; drift?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!motionOK()) {
        el.classList.remove("clip--pending");
        return;
      }
      const inner = el.querySelector<HTMLElement>(".media > img, .media > video, .media > .plate");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        delay,
        onComplete: () => el.classList.remove("clip--pending"),
      });
      tl.fromTo(
        el,
        { clipPath: "inset(12% 9% 12% 9%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.out" }
      ).fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.out" }, 0);
      if (inner) tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 2.2, ease: "power2.out", ...(drift ? {} : { clearProps: "transform" }) }, 0);
      if (drift && inner) {
        gsap.fromTo(
          el.querySelector(".media"),
          { yPercent: -drift, scale: 1 + drift / 50 },
          { yPercent: drift, scale: 1 + drift / 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } }
        );
      }
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`clip clip--pending ${className}`}>
      {children}
    </div>
  );
}

/** Gentle vertical drift tied to scroll. `speed` is the travel in percent. */
export function Parallax({ children, speed = 8, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionOK()) return;
      gsap.fromTo(
        el,
        { yPercent: speed },
        { yPercent: -speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
