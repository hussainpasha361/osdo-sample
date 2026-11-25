"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap, motionOK } from "@/lib/gsap";
import { MarkLines } from "@/components/brand/Logo";

/**
 * Route changes play a short olive curtain with the mark drawing itself:
 * cover (≈0.5s) → navigate → reveal (≈0.6s). Instant under reduced motion,
 * and modified clicks (new tab etc.) are never intercepted.
 */
type Ctx = { go: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ go: () => {} });

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);

  const go = useCallback(
    (href: string) => {
      const el = curtain.current;
      const target = href.split("#")[0] || "/";
      if (target === pathname) {
        if (href.includes("#")) router.push(href);
        else if (window.__lenis) window.__lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: motionOK() ? "smooth" : "auto" });
        return;
      }
      if (!el || !motionOK()) {
        router.push(href);
        return;
      }
      pending.current = true;
      el.classList.add("is-active");
      window.__lenis?.stop();
      gsap
        .timeline()
        .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "expo.inOut" })
        .fromTo(el.querySelectorAll("[data-stroke]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.05, ease: "power2.inOut" }, 0.15)
        .add(() => router.push(href), 0.5);
    },
    [pathname, router]
  );

  // Reveal once the new route has rendered.
  useEffect(() => {
    const el = curtain.current;
    if (!el || !pending.current) return;
    pending.current = false;
    gsap
      .timeline({ delay: 0.08 })
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" })
      .add(() => {
        el.classList.remove("is-active");
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        window.__lenis?.start();
      });
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <div ref={curtain} className="pt" aria-hidden="true">
        <MarkLines className="pt-mark draw" />
      </div>
    </TransitionCtx.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionCtx);
}

/** Drop-in for next/link that plays the page transition for internal routes. */
export function Link({
  href,
  children,
  onClick,
  ...rest
}: React.ComponentProps<typeof NextLink> & { href: string }) {
  const { go } = useTransition();
  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!href.startsWith("/")) return;
        e.preventDefault();
        go(href);
      }}
    >
      {children}
    </NextLink>
  );
}
