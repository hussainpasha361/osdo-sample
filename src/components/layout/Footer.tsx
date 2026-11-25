import { Link } from "./PageTransition";
import ConstructedWordmark from "@/components/brand/ConstructedWordmark";
import { GridToggle } from "./GridOverlay";
import { nav, site, PENDING } from "@/content/site";

/** The closing page: the constructed wordmark, then only what is useful. */
export default function Footer() {
  const year = new Date().getFullYear();
  const c = site.contact;
  return (
    <footer className="footer" data-nav-tone="ivory" data-section="OSDO">
      <div className="wrap">
        <ConstructedWordmark />
        <p className="fw-hint t-note mt-3 text-right">Move across the letters, or tap one to redraw it</p>
      </div>

      <div className="grid-12 mt-[clamp(48px,6vw,96px)] gap-y-10">
        <p className="col-span-6 md:col-span-4 t-m max-w-[22ch]">{site.fullName}</p>

        <nav className="col-span-3 md:col-span-2 md:col-start-6" aria-label="Footer">
          <ul className="grid gap-1.5">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="u-line">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-3 md:col-span-2 grid content-start gap-1.5">
          <a href={site.instagram.url} target="_blank" rel="noreferrer" className="u-line justify-self-start">
            Instagram
          </a>
          {c.email ? (
            <a href={`mailto:${c.email}`} className="u-line justify-self-start">
              {c.email}
            </a>
          ) : (
            <span className="opacity-60">Email: {PENDING.toLowerCase()}</span>
          )}
          {c.phone ? <a href={`tel:${c.phone}`}>{c.phone}</a> : <span className="opacity-60">Phone: {PENDING.toLowerCase()}</span>}
        </div>

        <address className="col-span-6 md:col-span-3 not-italic opacity-80">
          {c.address ? c.address.map((l) => <span key={l} className="block">{l}</span>) : <span className="opacity-75">Studio address {PENDING.toLowerCase()}</span>}
        </address>
      </div>

      <div className="wrap">
        <div className="footer-base flex flex-wrap items-center justify-between gap-x-8 gap-y-3 t-small">
          <span>
            © {year} {site.name}
          </span>
          <GridToggle className="u-line" />
          <span>
            Website by{" "}
            {site.credit.url ? (
              <a href={site.credit.url} className="u-line" target="_blank" rel="noreferrer">
                {site.credit.name}
              </a>
            ) : (
              site.credit.name
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
