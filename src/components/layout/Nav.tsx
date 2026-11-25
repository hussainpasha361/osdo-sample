"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "./PageTransition";
import { Lockup } from "@/components/brand/Logo";
import Media from "@/components/media/Media";
import { nav, site } from "@/content/site";
import { projects } from "@/content/projects";
import { studioPhotos } from "@/content/studio";
import { stages } from "@/content/approach";
import { ScrollTrigger } from "@/lib/gsap";

const previews = {
  "/work": projects[0]?.cover,
  "/studio": studioPhotos[1],
  "/approach": stages[0]?.media,
  "/contact": studioPhotos[2],
} as const;

/**
 * Items sit on the 12-column grid (logo, four links, menu) rather than in a
 * cluster. Colour follows the section underneath via [data-nav-tone] markers.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string>("/work");
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Tone + hide-on-scroll. Re-bound per page.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const triggers: ScrollTrigger[] = [];
    const id = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-nav-tone]").forEach((sec) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: () => `top ${el.offsetHeight / 2}`,
            end: () => `bottom ${el.offsetHeight / 2}`,
            onToggle: (s) => {
              if (s.isActive) el.dataset.tone = sec.dataset.navTone;
              else if (el.dataset.tone === sec.dataset.navTone) delete el.dataset.tone;
            },
          })
        );
      });
      triggers.push(
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (s) => {
            const y = s.scroll();
            el.classList.toggle("is-hidden", s.direction === 1 && y > window.innerHeight * 0.6);
          },
        })
      );
    }, 200);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
      delete el.dataset.tone;
      el.classList.remove("is-hidden");
    };
  }, [pathname]);

  // Menu: lock scroll, trap focus, Escape closes.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-open", open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    if (!open) return;
    const items = () => Array.from(menu.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    window.setTimeout(() => items()[0]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
      if (e.key === "Tab") {
        const f = [btn.current!, ...items()];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header ref={bar} className="nav">
        <Link href="/" className="nav-logo" aria-label={`${site.name}, home`}>
          <Lockup />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link u-line" aria-current={current(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button ref={btn} type="button" className="nav-menu-btn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
          <span>{open ? "Close" : "Menu"}</span>
          <span className="nav-menu-icon" aria-hidden="true" />
        </button>
      </header>

      <div id="site-menu" ref={menu} className="menu" aria-hidden={!open} inert={!open}>
        <div className="menu-inner">
          <ul className="menu-list">
            {[{ href: "/", label: "Home" }, ...nav].map((l) => (
              <li key={l.href} className="menu-item">
                <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} onMouseEnter={() => l.href !== "/" && setHover(l.href)} onFocus={() => l.href !== "/" && setHover(l.href)}>
                  <span>{l.label}</span>
                  <span className="menu-dot" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-preview arch" aria-hidden="true">
            {Object.entries(previews).map(([href, m]) =>
              m ? (
                <div key={href} style={{ opacity: hover === href ? 1 : 0, transform: hover === href ? "scale(1)" : "scale(1.06)" }}>
                  <Media media={m} fill sizes="30vw" showLabel={false} />
                </div>
              ) : null
            )}
          </div>
          <div className="menu-foot">
            <a href={site.instagram.url} target="_blank" rel="noreferrer" className="u-line">
              Instagram
            </a>
            <span>{site.contact.email ?? "Email to be confirmed"}</span>
            <span className="opacity-70">{site.fullName}</span>
          </div>
        </div>
      </div>
    </>
  );
}
