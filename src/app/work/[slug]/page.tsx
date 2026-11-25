import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import ProjectBlocks from "@/components/work/ProjectBlocks";
import Transformation from "@/components/work/Transformation";
import { ClipReveal, RevealText } from "@/components/motion/Reveal";
import { getNeighbours, getProject, groupOf, orientationOf, projects } from "@/content/projects";
import { composeBlocks } from "@/lib/compose";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const cover = p.cover.kind === "image" ? [{ url: p.cover.src, alt: p.cover.alt }] : undefined;
  return { title: p.title, description: p.summary ?? `${p.title}. ${p.category ?? ""}`.trim(), openGraph: { images: cover } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const group = groupOf(project);
  const { prev, next } = getNeighbours(slug);
  const blocks = project.transformation ? [] : composeBlocks(project, projects.indexOf(project));
  const groupLabel = project.group === "completed" ? "Completed project" : "Concept and design study";
  const landscape = orientationOf(project.cover) === "landscape";

  const facts = [
    { k: "Type", v: project.category },
    { k: "Location", v: project.location },
    { k: "Year", v: project.year },
    { k: "Area", v: project.area },
    { k: "Status", v: project.status, flag: true },
    { k: "Imagery", v: project.mediaNote, flag: true },
    { k: "Title", v: project.titleNote, flag: true },
    ...(project.credits?.map((c) => ({ k: c.label, v: c.value })) ?? []),
  ].filter((f) => f.v) as { k: string; v: string; flag?: boolean }[];

  const Facts = (
    <dl className="pj-facts grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
      {facts.map((f) => (
        <div key={f.k}>
          <dt className="t-note text-graphite">{f.k}</dt>
          <dd className={`t-small mt-1 ${f.flag ? "text-orange-ink" : ""}`}>{f.v}</dd>
        </div>
      ))}
    </dl>
  );

  const titleSize = landscape && project.title.length <= 22 ? "t-xxl" : "t-xl";
  const Title = (
    <>
      <p className="t-note mb-5 flex gap-3">
        <span className="num">
          {project.number} / {String(group.length).padStart(2, "0")}
        </span>
        <span className="text-graphite">{groupLabel}</span>
      </p>
      <RevealText as="h1" className={`${titleSize} pj-title`} text={project.title} start="top 100%" />
    </>
  );

  return (
    <article>
      {landscape ? (
        <header className="pj-hero">
          <div className="grid-12 items-end gap-y-8 pb-[clamp(32px,5vw,72px)]">
            <div className="col-span-6 md:col-span-8">{Title}</div>
            <div className="col-span-6 md:col-span-4">{Facts}</div>
          </div>
          <div className="wrap">
            <ClipReveal>
              <Media media={project.cover} sizes="(min-width: 768px) 94vw, 100vw" priority />
            </ClipReveal>
          </div>
        </header>
      ) : (
        <header className="pj-hero pj-hero--split">
          <div className="grid-12 gap-y-10">
            <div className="col-span-6 md:col-span-6 flex flex-col justify-between gap-10">
              <div>{Title}</div>
              <div className="max-w-[420px]">{Facts}</div>
            </div>
            <div className="col-span-6 md:col-start-7 md:col-span-6">
              <ClipReveal>
                <Media media={project.cover} sizes="(min-width: 768px) 48vw, 100vw" ratio={orientationOf(project.cover) === "portrait" ? "4 / 5" : undefined} priority />
              </ClipReveal>
            </div>
          </div>
        </header>
      )}

      <div className="py-[clamp(48px,7vw,120px)]">{project.transformation ? <Transformation project={project} /> : <ProjectBlocks blocks={blocks} />}</div>

      <nav className="pj-next" aria-label="More projects">
        <div className="grid-12 items-end gap-y-10 py-[clamp(48px,7vw,112px)]">
          {group.length > 1 ? (
            <>
              <Link href={`/work/${prev.slug}`} className="col-span-3 md:col-span-3" data-cursor="Previous project">
                <span className="t-note text-graphite">Previous</span>
                <span className="t-m mt-2 block u-line w-fit">{prev.title}</span>
              </Link>
              <Link href="/work" className="col-span-3 md:col-span-3 md:col-start-5 justify-self-end md:justify-self-start t-small u-line self-end">
                All projects
              </Link>
              <Link href={`/work/${next.slug}`} className="col-span-6 md:col-start-8 md:col-span-5 block" data-cursor="Next project">
                <span className="t-note text-graphite">Next</span>
                <span className="mt-3 flex items-end justify-between gap-6">
                  <span className="t-xl pj-next-title min-w-0">{next.title}</span>
                  <span className="w-[28%] shrink-0">
                    <Media media={next.cover} ratio="4 / 5" sizes="160px" showLabel={false} />
                  </span>
                </span>
              </Link>
            </>
          ) : (
            <Link href="/work" className="col-span-full t-m u-line w-fit">
              All projects
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
