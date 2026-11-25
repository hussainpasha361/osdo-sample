/**
 * OSDO mark, rebuilt from the Instagram profile image: a ring (O) resting on
 * a half-disc arch (D). Proportions measured from the source; replace with the
 * official vector when OSDO supplies it.
 */
export const MARK = {
  viewBox: "0 0 178 242",
  ring: { cx: 89, cy: 72, r: 59, stroke: 26 },
  arch: "M0 242V232A89 89 0 0 1 178 232V242ZM28.1 216A63 63 0 0 1 149.9 216Z",
};

export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={MARK.viewBox} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <circle cx={MARK.ring.cx} cy={MARK.ring.cy} r={MARK.ring.r} fill="none" stroke="currentColor" strokeWidth={MARK.ring.stroke} />
      <path d={MARK.arch} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Outline version of the mark for line-drawing animations (single stroke paths). */
export function MarkLines({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="-4 -4 186 250" aria-hidden="true">
      <circle cx="89" cy="72" r="72" pathLength={1} data-stroke />
      <circle cx="89" cy="72" r="46" pathLength={1} data-stroke />
      <path d="M0 242V232A89 89 0 0 1 178 232V242Z" pathLength={1} data-stroke />
      <path d="M28.1 216A63 63 0 0 1 149.9 216Z" pathLength={1} data-stroke />
    </svg>
  );
}

export function Lockup({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[22px] w-auto" />
      <span className="font-display text-[19px] font-bold tracking-[-0.03em]">OSDO</span>
    </span>
  );
}
