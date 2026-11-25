import Hero from "@/components/home/Hero";
import CompletedProjects from "@/components/work/CompletedProjects";
import InsideOsdo from "@/components/home/InsideOsdo";
import PlanToSpace from "@/components/home/PlanToSpace";
import ContactBand from "@/components/home/ContactBand";
import { completedProjects, featuredProjects, flagship, studies } from "@/content/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <CompletedProjects
        projects={featuredProjects}
        total={completedProjects.length}
        flagshipSlug={flagship.slug}
        showAllLink
        allLabel={studies.length ? "All projects, concepts and studies" : "All projects"}
      />
      <InsideOsdo />
      <PlanToSpace />
      <ContactBand />
    </>
  );
}
