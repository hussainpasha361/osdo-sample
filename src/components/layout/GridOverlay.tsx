"use client";

import { useEffect, useState } from "react";

/** Press G (outside form fields) to show the 12-column layout grid. */
export default function GridOverlay() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) setOn((v) => !v);
    };
    const onToggle = () => setOn((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("osdo:grid", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("osdo:grid", onToggle);
    };
  }, []);
  return (
    <div className={`grid-overlay ${on ? "is-on" : ""}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function GridToggle({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("osdo:grid"))}>
      Show the grid <span className="opacity-60">(G)</span>
    </button>
  );
}
