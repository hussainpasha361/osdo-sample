import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import { ClipReveal } from "@/components/motion/Reveal";
import type { Media as M, Project } from "@/content/types";

/**
 * Gallery mode: each project hung as its own composition. Four arrangements
 * rotate so no two neighbours share a layout; any number of projects works.
 */

function Marks({ num }: { num: string }) {
  return (
    <>
      <span className="cmark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="cmark-num t-note" aria-hidden="true">
        {num}
      </span>
    </>
  );
}

function Caption({ p, className = "" }: { p: Project; className?: string }) {
  const meta = [p.category, p.location, p.year].filter(Boolean).join(", ");
  return (
    <div className={`ex-cap ${className}`}>
      <span className="num t-note">{p.number}</span>
      <span className="t-l">{p.title}</span>
      {meta ? <span className="ex-meta t-small ml-auto">{meta}</span> : null}
    </div>
  );
}

function Frame({ m, ratio, sizes, num }: { m: M; ratio: string; sizes: string; num?: string }) {
  return (
    <div className="ex-frame">
      <ClipReveal>
        <Media media={m} ratio={ratio} sizes={sizes} />
      </ClipReveal>
      {num ? <Marks num={num} /> : null}
    </div>
  );
}

export default function Exhibition({ projects }: { projects: Project[] }) {
  return (
    <ol className="ex" aria-label="Completed projects">
      {projects.map((p, i) => {
        const second = p.media[1] ?? p.cover;
        const v = i % 4;
        const label = `View ${p.title}`;
        if (v === 0)
          return (
            <li key={p.slug} className="ex-item">
              <Link href={`/work/${p.slug}`} className="ex-link block" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} ratio="16 / 9" sizes="100vw" num={p.number} />
                <div className="wrap">
                  <Caption p={p} />
                </div>
              </Link>
            </li>
          );
        if (v === 1)
          return (
            <li key={p.slug} className="ex-item grid-12">
              <Link href={`/work/${p.slug}`} className="ex-link col-span-6 md:col-start-2 md:col-span-5" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} ratio="4 / 5" sizes="(min-width: 768px) 40vw, 100vw" num={p.number} />
                <Caption p={p} />
              </Link>
              <div className="col-span-4 col-start-3 mt-6 md:col-start-8 md:col-span-5 md:mt-[34%]" aria-hidden="true">
                <Frame m={second} ratio="3 / 2" sizes="(min-width: 768px) 40vw, 70vw" />
              </div>
            </li>
          );
        if (v === 2)
          return (
            <li key={p.slug} className="ex-item grid-12 items-end">
              <div className="col-span-6 order-2 md:order-1 md:col-span-3 md:pb-2">
                <span className="num t-note block">{p.number}</span>
                <Link href={`/work/${p.slug}`} className="t-xl mt-3 block u-line" tabIndex={-1}>
                  {p.title}
                </Link>
                {[p.category, p.location, p.year].some(Boolean) ? (
                  <p className="t-small text-graphite mt-3">{[p.category, p.location, p.year].filter(Boolean).join(", ")}</p>
                ) : null}
              </div>
              <Link href={`/work/${p.slug}`} className="ex-link col-span-6 order-1 md:order-2 md:col-start-5 md:col-span-8" data-cursor="View project" aria-label={label}>
                <Frame m={p.cover} ratio="3 / 2" sizes="(min-width: 768px) 66vw, 100vw" num={p.number} />
              </Link>
            </li>
          );
        return (
          <li key={p.slug} className="ex-item grid-12">
            <div className="col-span-3 mt-[30%] md:col-span-3 md:col-start-1 md:mt-[22%]" aria-hidden="true">
              <Frame m={second} ratio="4 / 5" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <Link href={`/work/${p.slug}`} className="ex-link col-span-3 md:col-start-5 md:col-span-5" data-cursor="View project" aria-label={label}>
              <Frame m={p.cover} ratio="4 / 5" sizes="(min-width: 768px) 40vw, 50vw" num={p.number} />
              <Caption p={p} />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
