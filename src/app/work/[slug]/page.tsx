import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import ProjectBlocks from "@/components/work/ProjectBlocks";
import { ClipReveal, RevealText } from "@/components/motion/Reveal";
import { getNeighbours, getProject, projects } from "@/content/projects";
import { composeBlocks } from "@/lib/compose";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const { prev, next } = getNeighbours(slug);
  const blocks = composeBlocks(project, index);
  const facts = [
    { k: "Type", v: project.category },
    { k: "Location", v: project.location },
    { k: "Year", v: project.year },
    { k: "Area", v: project.area },
    ...(project.credits?.map((c) => ({ k: c.label, v: c.value })) ?? []),
  ].filter((f) => f.v);

  return (
    <article>
      <header className="pj-hero">
        <div className="grid-12 items-end gap-y-8 pb-[clamp(32px,5vw,72px)]">
          <div className="col-span-6 md:col-span-8">
            <p className="num t-note mb-5">
              {project.number} / {String(projects.length).padStart(2, "0")}
            </p>
            <RevealText as="h1" className="t-xxl" text={project.title} start="top 100%" />
          </div>
          <dl className="pj-facts col-span-6 md:col-span-4 grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
            {facts.length ? (
              facts.map((f) => (
                <div key={f.k}>
                  <dt className="t-note">{f.k}</dt>
                  <dd className="t-small mt-1">{f.v}</dd>
                </div>
              ))
            ) : (
              <div className="col-span-2">
                <dt className="t-note">Project details</dt>
                <dd className="t-small mt-1 text-orange-ink">To come from the studio</dd>
              </div>
            )}
          </dl>
        </div>
        <ClipReveal>
          <Media media={project.cover} sizes="100vw" ratio="16 / 9" priority />
        </ClipReveal>
      </header>

      <div className="py-[clamp(48px,7vw,120px)]">
        <ProjectBlocks blocks={blocks} />
      </div>

      <nav className="pj-next" aria-label="More projects">
        <div className="grid-12 items-end gap-y-10 py-[clamp(48px,7vw,112px)]">
          <Link href={`/work/${prev.slug}`} className="col-span-3 md:col-span-3 group" data-cursor="Previous project">
            <span className="t-note text-graphite">Previous</span>
            <span className="t-m mt-2 block u-line w-fit">{prev.title}</span>
          </Link>
          <Link href="/work" className="col-span-3 md:col-span-3 md:col-start-5 justify-self-end md:justify-self-start t-small u-line self-end">
            All completed projects
          </Link>
          <Link href={`/work/${next.slug}`} className="col-span-6 md:col-start-8 md:col-span-5 ex-link block" data-cursor="Next project">
            <span className="t-note text-graphite">Next project</span>
            <span className="mt-3 flex items-end justify-between gap-6">
              <span className="t-xl">{next.title}</span>
              <span className="w-[28%] shrink-0">
                <Media media={next.cover} ratio="4 / 5" sizes="160px" showLabel={false} />
              </span>
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
