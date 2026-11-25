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

/** Media opens upward from its base, with the image settling from a slight zoom. */
export function ClipReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!motionOK()) {
        el.classList.remove("clip--pending");
        return;
      }
      const inner = el.querySelector(".media > img, .media > video, .media > .plate");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        delay,
        onComplete: () => {
          el.classList.remove("clip--pending");
          gsap.set(el, { clearProps: "clipPath" });
        },
      });
      tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" });
      if (inner) tl.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0.1);
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`clip--pending ${className}`}>
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
