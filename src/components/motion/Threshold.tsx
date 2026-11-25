"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/**
 * Entering a new space: a grid bubble and an orange dimension line that
 * draws across the page as the section arrives, scrubbed to scroll.
 */
export default function Threshold({ mark, label, className = "" }: { mark: string; label?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionOK()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 96%", end: "top 55%", scrub: 0.6 } });
      tl.fromTo(el.querySelector(".threshold-node"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(2)" }, 0)
        .fromTo(el.querySelector(".threshold-line"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0.1)
        .fromTo(el.querySelector(".threshold-label"), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3 }, 0.8);
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`threshold ${className}`} aria-hidden="true">
      <span className="threshold-node">{mark}</span>
      <span className="threshold-line" />
      {label ? <span className="threshold-label">{label}</span> : null}
    </div>
  );
}
