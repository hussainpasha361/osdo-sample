"use client";

import { useRef } from "react";
import { Link } from "@/components/layout/PageTransition";
import { RevealText } from "@/components/motion/Reveal";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { site } from "@/content/site";

/** Orange band: one invitation, drawn over the outline of the OSDO arch. */
export default function ContactBand() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const svg = ref.current?.querySelector(".cta-arch");
      if (!svg) return;
      if (!motionOK()) {
        svg.classList.remove("draw--pending");
        return;
      }
      gsap.fromTo(svg.querySelectorAll("[data-stroke]"), { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.15,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
        onComplete: () => svg.classList.remove("draw--pending"),
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="cta" aria-labelledby="cta-title">
      <svg className="cta-arch draw draw--pending" viewBox="-2 -2 182 246" aria-hidden="true">
        <circle cx="89" cy="72" r="72" pathLength={1} data-stroke />
        <circle cx="89" cy="72" r="46" pathLength={1} data-stroke />
        <path d="M0 242V232A89 89 0 0 1 178 232V242Z" pathLength={1} data-stroke />
        <path d="M28.1 216A63 63 0 0 1 149.9 216Z" pathLength={1} data-stroke />
        <path d="M89 0V242M0 72H178M0 232H178" pathLength={1} data-stroke strokeDasharray="1" opacity="0.5" />
      </svg>
      <div className="grid-12 relative gap-y-12">
        <RevealText as="h2" id="cta-title" className="t-xxl col-span-6 md:col-span-9" text={["Start", "a project"]} />
        <div className="col-span-6 md:col-span-5 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/contact" className="btn-line btn-line--charcoal" data-cursor="Write to us">
            <span>Write to the studio</span>
          </Link>
          {site.contact.email ? (
            <a href={`mailto:${site.contact.email}`} className="u-line t-m">
              {site.contact.email}
            </a>
          ) : (
            <span className="t-small">Studio email to be confirmed</span>
          )}
        </div>
      </div>
    </section>
  );
}
