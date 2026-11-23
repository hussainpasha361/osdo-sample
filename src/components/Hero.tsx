import Plate from "./Plate";
import { site } from "@/data/site";

/** Cover sheet: meta row, statement, lead image and the full-width wordmark. */
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title" data-guides>
      <div className="hero-guides" aria-hidden="true">
        <span className="guide guide-x" />
        <span className="guide guide-y" />
      </div>

      <div className="hero-meta">
        <span data-intro="sub">Sheet A-000 — Cover</span>
        <span data-intro="sub">{site.coords}</span>
        <span data-intro="sub">{site.disciplines.slice(0, 3).join(" · ")}</span>
        <span data-intro="sub">Est. {site.established}</span>
      </div>

      <div className="hero-body">
        <h1 id="hero-title" className="hero-title" data-intro="title">
          <span className="ln">
            <span className="ln-i">Buildings</span>
          </span>
          <span className="ln">
            <span className="ln-i">
              drawn from <em>the</em>
            </span>
          </span>
          <span className="ln">
            <span className="ln-i">
              <em>plan</em> up.
            </span>
          </span>
        </h1>

        <div className="hero-side">
          <a href="#work" className="pill" data-intro="sub" data-magnetic>
            <span>See the work</span>
            <span className="pill-dot" aria-hidden="true" />
          </a>
          <p className="hero-lede" data-intro="sub">
            An architecture and interiors practice in {site.city}, designing houses, workplaces and landscapes for heat,
            light and everyday life.
          </p>
        </div>

        <div className="hero-plate" data-intro="plate">
          <Plate kind="axo" tone={1} label="Lead project" />
          <span className="fig">Fig. 01 — Lead project, {site.city}</span>
        </div>
      </div>

      <div className="hero-mark-wrap">
        <div className="dim" aria-hidden="true" data-intro="rule">
          <span className="dim-tick" />
          <span className="dim-line" />
          <span className="dim-label">O · S · D · O</span>
          <span className="dim-line" />
          <span className="dim-tick" />
        </div>
        <p className="hero-mark" aria-label={site.name} data-intro="mark">
          {"OSDO".split("").map((c, i) => (
            <span className="hm-l" key={i} aria-hidden="true">
              {c}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
