import { Link } from "@/components/layout/PageTransition";
import Media from "@/components/media/Media";
import { ClipReveal, Parallax, RevealText } from "@/components/motion/Reveal";
import { studioFilm, studioPhotos } from "@/content/studio";

const [arch, shelving, door, desk] = studioPhotos;

/**
 * The studio, seen rather than described. The film sits in an arch, the
 * shape of the studio's own doorway and of the OSDO mark.
 */
export default function InsideOsdo({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={`inside ${standalone ? "pt-[calc(var(--nav-h)+clamp(48px,8vw,120px))]" : ""}`} aria-labelledby="inside-title" data-nav-tone="ivory">
      <div className="grid-12 gap-y-14">
        <div className="col-span-6 md:col-span-4 md:row-span-2 flex flex-col justify-between gap-10">
          <div>
            <RevealText as={standalone ? "h1" : "h2"} id="inside-title" className="t-xxl" text={["Inside", "OSDO"]} />
            <p className="t-m mt-6 max-w-[18ch] text-ivory/80">A look around the studio.</p>
          </div>
          {!standalone ? (
            <Link href="/studio" className="btn-line self-start" data-cursor="Enter the studio">
              <span>Visit the studio</span>
            </Link>
          ) : null}
        </div>

        <figure className="col-span-6 md:col-span-4 md:col-start-5 inside-film" data-cursor="Studio film">
          <ClipReveal className="arch">
            <Media media={studioFilm} sizes="(min-width: 768px) 33vw, 90vw" />
          </ClipReveal>
          <figcaption className="inside-cap t-note">Studio film, provisional cut</figcaption>
        </figure>

        <figure className="col-span-3 md:col-span-3 md:col-start-10 md:mt-[46%]">
          <Parallax speed={6}>
            <ClipReveal>
              <Media media={shelving} ratio="4 / 5" sizes="(min-width: 768px) 25vw, 50vw" />
            </ClipReveal>
          </Parallax>
          <figcaption className="inside-cap t-note">steel and oak</figcaption>
        </figure>

        <figure className="col-span-3 md:col-span-3 md:col-start-1 md:-mt-[30%] mt-16">
          <Parallax speed={10}>
            <ClipReveal>
              <Media media={door} ratio="3 / 4" sizes="(min-width: 768px) 25vw, 50vw" />
            </ClipReveal>
          </Parallax>
          <figcaption className="inside-cap t-note">fluted wall, olive door</figcaption>
        </figure>

        <figure className="col-span-6 md:col-span-5 md:col-start-6 md:mt-10">
          <ClipReveal>
            <Media media={desk} ratio="16 / 10" sizes="(min-width: 768px) 42vw, 100vw" />
          </ClipReveal>
          <figcaption className="inside-cap t-note">planters, timber bench</figcaption>
        </figure>

        {standalone ? (
          <figure className="col-span-6 md:col-span-6 md:col-start-4 mt-10">
            <ClipReveal>
              <Media media={arch} ratio="4 / 5" sizes="(min-width: 768px) 50vw, 100vw" />
            </ClipReveal>
            <figcaption className="inside-cap t-note">pantry arch, leaf shadow</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
