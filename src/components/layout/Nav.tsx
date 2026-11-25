"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "./PageTransition";
import { Mark } from "@/components/brand/Logo";
import Media from "@/components/media/Media";
import { nav, site } from "@/content/site";
import { projects, residentialMedia } from "@/content/projects";
import { studioPhotos } from "@/content/studio";
import { ScrollTrigger } from "@/lib/gsap";

const previews = {
  "/work": projects[0]?.cover,
  "/studio": studioPhotos[1],
  "/approach": residentialMedia.planProposed,
  "/contact": studioPhotos[2],
} as const;

/** Text that rolls up to a second copy on hover. */
function Roll({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

/**
 * The bar reads like a drawing title block: one cell each for the mark, the
 * section you are in, the four destinations and the menu. It turns solid
 * once you scroll, follows the tone of the section below ([data-nav-tone]),
 * and draws an orange progress line along its base.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string>("/work");
  const [here, setHere] = useState<string>("");
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Tone, solid state, progress and the current section. Re-bound per page.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const triggers: ScrollTrigger[] = [];
    const id = window.setTimeout(() => {
      const mid = () => el.offsetHeight / 2 + 12;
      document.querySelectorAll<HTMLElement>("[data-nav-tone]").forEach((sec) => {
        if (sec.closest(".menu")) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: () => `top ${mid()}`,
            end: () => `bottom ${mid()}`,
            onToggle: (s) => {
              if (s.isActive) el.dataset.tone = sec.dataset.navTone;
              else if (el.dataset.tone === sec.dataset.navTone) delete el.dataset.tone;
            },
          })
        );
      });
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      setHere(sections[0]?.dataset.section ?? "");
      sections.forEach((sec) =>
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (s) => s.isActive && setHere(sec.dataset.section ?? ""),
          })
        )
      );
      triggers.push(
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (s) => {
            el.classList.toggle("is-solid", s.scroll() > 24);
            if (progress.current) progress.current.style.transform = `scaleX(${s.progress})`;
          },
        })
      );
    }, 250);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
      delete el.dataset.tone;
      el.classList.remove("is-solid");
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
        <div className="nav-bar">
          <Link href="/" className="nav-cell nav-logo" aria-label={`${site.name}, home`}>
            <Mark className="nav-mark" />
            <span className="nav-word">OSDO</span>
          </Link>

          <div className="nav-cell nav-here" aria-live="polite">
            <span className="nav-here-dot" aria-hidden="true" />
            <span className="nav-here-txt" key={here}>
              {here || site.name}
            </span>
          </div>

          <nav className="nav-links" aria-label="Primary">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className="nav-cell nav-link" aria-current={current(l.href)}>
                <Roll>{l.label}</Roll>
              </Link>
            ))}
          </nav>

          <button ref={btn} type="button" className="nav-cell nav-menu-btn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
            <Roll>{open ? "Close" : "Menu"}</Roll>
            <span className="nav-menu-icon" aria-hidden="true" />
          </button>
          <span className="nav-progress" aria-hidden="true">
            <span ref={progress} />
          </span>
        </div>
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
