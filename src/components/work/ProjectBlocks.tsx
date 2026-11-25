import Media from "@/components/media/Media";
import { ClipReveal, Parallax } from "@/components/motion/Reveal";
import { orientationOf } from "@/content/projects";
import type { Media as M, ProjectBlock } from "@/content/types";

export function Fig({ m, sizes, ratio, className = "", label = true }: { m: M; sizes: string; ratio?: string; className?: string; label?: boolean }) {
  const text = label ? (m.label ?? m.caption) : m.caption;
  return (
    <figure className={className}>
      <ClipReveal>
        <Media media={m} sizes={sizes} ratio={ratio} />
      </ClipReveal>
      {text ? <figcaption className="fig-note t-note">{text}</figcaption> : null}
    </figure>
  );
}

const tall = (m: M) => m.width / m.height < 0.6;

/** Drawings laid on one sheet. Hovering one brings it forward. */
export function PlanSheet({ plans, note, className = "" }: { plans: M[]; note?: string; className?: string }) {
  const paper = plans[0]?.paper;
  return (
    <div className={`plan-sheet ${className}`} style={paper ? { background: paper } : undefined}>
      <div className="grid-12 items-end gap-y-10">
        {plans.map((p, i) => (
          <figure key={p.kind === "image" ? p.src : i} className={`plan ${plans.length === 1 ? "col-span-6 md:col-start-4 md:col-span-6" : i === 0 ? "col-span-6 md:col-start-2 md:col-span-5" : "col-span-6 md:col-start-7 md:col-span-5"}`}>
            <ClipReveal>
              <Media media={p} sizes="(min-width: 768px) 42vw, 92vw" />
            </ClipReveal>
            <figcaption className="plan-cap t-note">
              <span className="plan-node" aria-hidden="true" />
              {p.label ?? p.alt}
            </figcaption>
          </figure>
        ))}
        {note ? <p className="col-span-6 md:col-start-2 md:col-span-6 t-note text-graphite">{note}</p> : null}
      </div>
    </div>
  );
}

/** Renders composed or hand-authored blocks. Every layout sits on the 12-column grid. */
export default function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  return (
    <div className="pj-blocks">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "chapter":
            return (
              <div key={i} className="grid-12 pt-[clamp(32px,5vw,80px)]">
                <p className="pj-chapter col-span-full t-note">
                  <span className="plan-node" aria-hidden="true" />
                  <span>{b.label}</span>
                  {b.count ? <span className="num">({String(b.count).padStart(2, "0")})</span> : null}
                  <span className="pj-chapter-rule" aria-hidden="true" />
                </p>
              </div>
            );
          case "full":
            return <Fig key={i} m={b.media} sizes="100vw" />;
          case "inset": {
            const land = orientationOf(b.media) === "landscape";
            const cls = land
              ? b.align === "right"
                ? "col-span-6 md:col-start-4 md:col-span-9"
                : "col-span-6 md:col-start-1 md:col-span-9"
              : b.align === "right"
                ? "col-span-5 col-start-2 md:col-start-7 md:col-span-5"
                : "col-span-5 md:col-start-2 md:col-span-5";
            return (
              <div key={i} className="grid-12 py-[clamp(16px,4vw,64px)]">
                <Fig m={b.media} className={cls} sizes={land ? "(min-width: 768px) 75vw, 100vw" : "(min-width: 768px) 42vw, 85vw"} />
              </div>
            );
          }
          case "pair": {
            const [a, c] = b.media;
            const flipped = i % 2 === 1;
            const first = tall(a) ? "col-span-4 md:col-start-2 md:col-span-4" : flipped ? "col-span-6 md:col-start-2 md:col-span-5" : "col-span-6 md:col-span-6";
            const second = tall(a)
              ? "col-span-5 col-start-2 md:col-start-7 md:col-span-5 md:mt-[30%]"
              : flipped
                ? "col-span-5 col-start-2 md:col-start-8 md:col-span-4 md:mt-[22%]"
                : "col-span-5 col-start-2 md:col-start-8 md:col-span-5 md:mt-[16%]";
            return (
              <div key={i} className="grid-12 items-start gap-y-6">
                <Fig m={a} className={first} sizes="(min-width: 768px) 46vw, 100vw" />
                <div className={second}>
                  <Parallax speed={4}>
                    <Fig m={c} sizes="(min-width: 768px) 40vw, 85vw" />
                  </Parallax>
                </div>
              </div>
            );
          }
          case "trio":
            return (
              <div key={i} className="grid-12 items-start gap-y-6">
                <Fig m={b.media[0]} className="col-span-3 md:col-span-4" sizes="(min-width: 768px) 32vw, 50vw" />
                <Fig m={b.media[1]} className="col-span-3 md:col-span-4 mt-[18%]" sizes="(min-width: 768px) 32vw, 50vw" />
                <Fig m={b.media[2]} className="col-span-4 col-start-2 md:col-span-4 md:mt-[8%]" sizes="(min-width: 768px) 32vw, 70vw" />
              </div>
            );
          case "video": {
            const portrait = orientationOf(b.media) === "portrait";
            return (
              <div key={i} className="grid-12 py-[clamp(16px,4vw,64px)]">
                <Fig
                  m={b.media}
                  className={portrait ? "col-span-4 col-start-2 md:col-start-6 md:col-span-3" : "col-span-6 md:col-start-3 md:col-span-8"}
                  sizes={portrait ? "(min-width: 768px) 24vw, 66vw" : "(min-width: 768px) 66vw, 100vw"}
                />
              </div>
            );
          }
          case "drawing":
            return <PlanSheet key={i} plans={[b.media]} note={b.note} />;
          case "plans":
            return <PlanSheet key={i} plans={b.media} note={b.note} />;
          case "text":
            return (
              <div key={i} className="grid-12 py-[clamp(24px,5vw,88px)]">
                <p className="col-span-6 md:col-start-4 md:col-span-6 t-m">{b.text}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
