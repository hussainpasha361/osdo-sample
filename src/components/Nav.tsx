"use client";

import { useEffect, useRef, useState } from "react";
import Clock from "./Clock";
import { site } from "@/data/site";

const links = [
  { href: "#work", label: "Work", code: "A-100" },
  { href: "#practice", label: "Practice", code: "A-200" },
  { href: "#studio", label: "Studio", code: "A-400" },
  { href: "#contact", label: "Contact", code: "A-500" },
];

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-open", open);
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    if (!open) return;
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
      if (e.key === "Tab") {
        const f = [btn.current!, ...focusables()];
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

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="nav" data-nav>
        <a href="#top" className="nav-logo" aria-label={`${site.name}, back to top`} data-intro="nav">
          <Mark />
          <span>{site.name}</span>
        </a>
        <span className="nav-full" data-intro="nav">
          {site.fullName}
        </span>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-intro="nav" className="u-link">
              {l.label}
            </a>
          ))}
        </nav>
        <span className="nav-clock" data-intro="nav">
          <Clock />
        </span>
        <button
          ref={btn}
          className="nav-burger"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
          data-intro="nav"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="burger-l" aria-hidden="true" />
          <span className="burger-l" aria-hidden="true" />
        </button>
      </header>

      <div id="menu" className="menu" ref={panel} aria-hidden={!open} inert={!open}>
        <ol className="menu-list">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                <span className="menu-code">{l.code}</span>
                <span className="menu-label">{l.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="menu-foot">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <Clock />
        </div>
      </div>
    </>
  );
}
