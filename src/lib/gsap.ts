"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Custom curves shared across the site (strong ease-out for entrances,
  // symmetric for transitions). Defined once so motion feels consistent.
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power2.out",
};

/** True when the visitor allows motion. Read at call time (it can change). */
export function motionOK() {
  return typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
