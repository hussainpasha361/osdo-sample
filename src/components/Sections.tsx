import Plate from "./Plate";
import { Sheet, Lines, Arrow } from "./ui";
import { featured, process } from "@/data/projects";
import { site } from "@/data/site";

/** Pinned plate that opens from an inset frame to full bleed as you scroll. */
export function Reel() {
  return (
    <section className="reel" aria-label="Studio reel" data-expand>
      <div className="reel-stick">
        <div className="reel-frame">
          <Plate kind="section" tone={4} label="Studio reel" draw={false} />
          <div className="reel-over">
            <span>Showreel / Film</span>
            <span className="reel-play" aria-hidden="true">
              ▶
            </span>
            <span>00:00 — 01:30</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Statement whose words brighten as they scroll past. */
export function Manifesto() {
  const text: (string | { em: string })[] = [
    "We are an architecture and interiors practice working from",
    `${site.city}.`,
    "We draw buildings that answer to",
    { em: "heat, light and shade" },
    "— houses turned inward around courtyards, workplaces that breathe, and interiors made as part of the structure rather than added to it.",
  ];
  const words: React.ReactNode[] = [];
  text.forEach((t, i) => {
    if (typeof t === "string")
      t.split(" ").forEach((w, j) =>
        words.push(
          <span className="w" key={`${i}-${j}`}>
            {w}{" "}
          </span>
        )
      );
    else
      t.em.split(" ").forEach((w, j) =>
        words.push(
          <em className="w" key={`${i}-e${j}`}>
            {w}{" "}
          </em>
        )
      );
  });
  return (
    <section className="manifesto wrap" aria-labelledby="m-title">
      <Sheet code="A-010" title="Statement" />
      <h2 id="m-title" className="sr-only">
        Statement
      </h2>
      <p className="manifesto-text" data-scrub-words>
        {words}
      </p>
      <div className="manifesto-foot">
        {site.disciplines.map((d, i) => (
          <span key={d} data-reveal="up">
            <i>0{i + 1}</i> {d}
          </span>
        ))}
      </div>
    </section>
  );
}

/** Horizontal run of lead projects, pinned on desktop, swipeable on touch. */
export function Featured() {
  return (
    <section className="featured" aria-labelledby="f-title" data-hscroll>
      <div className="featured-stick">
        <div className="featured-head wrap">
          <Sheet code="A-120" title="Featured projects" count={String(featured.length).padStart(2, "0")} />
          <h2 id="f-title" className="sr-only">
            Featured projects
          </h2>
          <span className="featured-progress" aria-hidden="true">
            <span data-hscroll-bar />
          </span>
        </div>
        <div className="featured-track" data-hscroll-track>
          {featured.map((p) => (
            <article className="fcard" key={p.no} data-cursor="View">
              <div className="fcard-media">
                <Plate kind={p.plate} tone={p.tone} label={p.title} />
              </div>
              <div className="fcard-body">
                <span className="fcard-no">{p.no}</span>
                <h3>{p.title}</h3>
                <p>{p.line}</p>
                <a href="#work" className="u-link fcard-link">
                  View project <Arrow />
                </a>
              </div>
            </article>
          ))}
          <div className="fcard fcard--end">
            <p>
              More work on <a href={site.instagram} target="_blank" rel="noreferrer" className="u-link">Instagram</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="process wrap" aria-labelledby="p-title">
      <Sheet code="A-300" title="Process" />
      <Lines as="h2" className="h-xl" lines={["Four stages,", <>one <em>drawing set.</em></>]} />
      <div className="process-line" data-progress-line aria-hidden="true">
        <span />
      </div>
      <ol className="process-list">
        {process.map((s) => (
          <li key={s.no} data-reveal="up">
            <span className="process-node" aria-hidden="true" />
            <span className="process-no">{s.no}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Studio() {
  const founders = [
    { name: "Ovais —", role: "Principal Architect", tone: 2 },
    { name: "Shahzad —", role: "Principal Architect", tone: 5 },
  ];
  return (
    <section className="studio wrap" id="studio" aria-labelledby="s-title">
      <Sheet code="A-400" title="Studio" />
      <div className="studio-grid">
        <div className="studio-intro">
          <Lines as="h2" className="h-xl" lines={["Two partners,", <>one <em>studio table.</em></>]} />
          <p data-reveal="up">
            OSDO was founded by Ovais and Shahzad to run a small, hands-on office where the partners draw every project
            themselves. The team works across architecture, interiors and landscape, so one set of hands carries an idea from
            the first sketch to the last detail on site.
          </p>
          <p className="note" data-reveal="up">
            Placeholder copy: founders&apos; full names, background and studio story to come from OSDO.
          </p>
        </div>
        <div className="founders">
          {founders.map((f, i) => (
            <figure key={f.name} className="founder" data-reveal="up">
              <div className={`portrait tone-${f.tone}`} data-parallax-wrap>
                <span className="portrait-cross" aria-hidden="true" />
                <span className="portrait-tag">Portrait {String(i + 1).padStart(2, "0")} · photo to come</span>
              </div>
              <figcaption>
                <b>{f.name}</b>
                <span>{f.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="c-title" data-theme="dark">
      <div className="wrap">
        <Sheet code="A-500" title="Contact" dark />
        <h2 id="c-title" className="contact-title" data-reveal="lines">
          <span className="ln">
            <span className="ln-i">Let&apos;s draw</span>
          </span>
          <span className="ln">
            <span className="ln-i">
              <em>something.</em>
            </span>
          </span>
        </h2>
        <div className="contact-grid">
          <a className="contact-mail" href={`mailto:${site.email}`} data-magnetic data-cursor="Write">
            {site.email}
            <Arrow />
          </a>
          <dl className="contact-list">
            <div data-reveal="up">
              <dt>Studio</dt>
              <dd>
                {site.address.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </dd>
            </div>
            <div data-reveal="up">
              <dt>Phone</dt>
              <dd>{site.phone}</dd>
            </div>
            <div data-reveal="up">
              <dt>Social</dt>
              <dd>
                <a href={site.instagram} target="_blank" rel="noreferrer" className="u-link">
                  Instagram
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Footer laid out as a drawing title block. */
export function Footer() {
  const year = new Date().getFullYear();
  const cells = [
    ["Project", "OSDO website"],
    ["Drawing", "General arrangement"],
    ["Scale", "NTS"],
    ["Date", String(year)],
    ["Sheet", "A-999"],
    ["Drawn", "OSDO"],
  ];
  return (
    <footer className="footer" data-theme="dark">
      <div className="titleblock">
        {cells.map(([k, v]) => (
          <div key={k} className="tb-cell">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <a href="#top" className="tb-cell tb-top">
          <span>Back to</span>
          <b>Top ↑</b>
        </a>
      </div>
      <div className="footer-base">
        <span>
          © {year} {site.fullName}
        </span>
        <span>{site.instagramHandle}</span>
      </div>
    </footer>
  );
}
