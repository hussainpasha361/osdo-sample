/** Small shared pieces: section sheet labels, split lines, arrows. */

export function Sheet({ code, title, count, dark = false }: { code: string; title: string; count?: string; dark?: boolean }) {
  return (
    <div className={`sheet ${dark ? "sheet--dark" : ""}`} data-reveal="fade">
      <span className="sheet-mark" aria-hidden="true" />
      <span className="sheet-code">{code}</span>
      <span className="sheet-rule" data-rule aria-hidden="true" />
      <span className="sheet-title">
        {title}
        {count ? <sup>({count})</sup> : null}
      </span>
    </div>
  );
}

/** Headline split into masked lines for the line-reveal. Pass explicit lines. */
export function Lines({ lines, as: Tag = "h2", className = "" }: { lines: React.ReactNode[]; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  return (
    <Tag className={className} data-reveal="lines">
      {lines.map((l, i) => (
        <span className="ln" key={i}>
          <span className="ln-i">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 L19 5 M8 5 H19 V16" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
