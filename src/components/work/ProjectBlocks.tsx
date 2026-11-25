import Media from "@/components/media/Media";
import { ClipReveal, Parallax } from "@/components/motion/Reveal";
import { orientationOf } from "@/content/projects";
import type { Media as M, ProjectBlock } from "@/content/types";

function Fig({ m, sizes, ratio, className = "" }: { m: M; sizes: string; ratio?: string; className?: string }) {
  return (
    <figure className={className}>
      <ClipReveal>
        <Media media={m} sizes={sizes} ratio={ratio} />
      </ClipReveal>
      {m.caption ? <figcaption className="t-note text-graphite mt-2.5">{m.caption}</figcaption> : null}
    </figure>
  );
}

/** Renders composed or hand-authored blocks. Every layout sits on the 12-column grid. */
export default function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  return (
    <div className="pj-blocks">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "full":
            return <Fig key={i} m={b.media} sizes="100vw" ratio={orientationOf(b.media) === "landscape" ? undefined : "16 / 9"} />;
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
              <div key={i} className="grid-12 py-[clamp(24px,5vw,80px)]">
                <Fig m={b.media} className={cls} sizes={land ? "(min-width: 768px) 75vw, 100vw" : "(min-width: 768px) 42vw, 85vw"} />
              </div>
            );
          }
          case "pair":
            return (
              <div key={i} className="grid-12 items-start gap-y-6">
                <Fig m={b.media[0]} className={i % 2 ? "col-span-6 md:col-start-2 md:col-span-5" : "col-span-6 md:col-span-6"} sizes="(min-width: 768px) 48vw, 100vw" />
                <div className={i % 2 ? "col-span-5 col-start-2 md:col-start-8 md:col-span-4 md:mt-[22%]" : "col-span-5 col-start-2 md:col-start-8 md:col-span-5 md:mt-[16%]"}>
                  <Parallax speed={5}>
                    <Fig m={b.media[1]} sizes="(min-width: 768px) 40vw, 85vw" />
                  </Parallax>
                </div>
              </div>
            );
          case "trio":
            return (
              <div key={i} className="grid-12 items-start gap-y-6">
                <Fig m={b.media[0]} className="col-span-3 md:col-span-4" sizes="(min-width: 768px) 32vw, 50vw" />
                <Fig m={b.media[1]} className="col-span-3 md:col-span-4 mt-[18%]" sizes="(min-width: 768px) 32vw, 50vw" />
                <Fig m={b.media[2]} className="col-span-4 col-start-2 md:col-span-4 md:mt-[8%]" sizes="(min-width: 768px) 32vw, 70vw" />
              </div>
            );
          case "video":
            return (
              <div key={i} className="grid-12">
                <Fig m={b.media} className="col-span-6 md:col-start-3 md:col-span-8" sizes="(min-width: 768px) 66vw, 100vw" />
              </div>
            );
          case "drawing":
            return (
              <div key={i} className="bg-ivory-2 py-[clamp(48px,7vw,112px)]">
                <div className="grid-12">
                  <Fig m={b.media} className="col-span-6 md:col-start-3 md:col-span-8" sizes="(min-width: 768px) 66vw, 100vw" />
                  {b.note ? <p className="col-span-6 md:col-start-3 md:col-span-6 t-note mt-4 text-graphite">{b.note}</p> : null}
                </div>
              </div>
            );
          case "text":
            return (
              <div key={i} className="grid-12 py-[clamp(40px,7vw,120px)]">
                <p className="col-span-6 md:col-start-4 md:col-span-6 t-m">{b.text}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
