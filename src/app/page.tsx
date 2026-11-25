import Hero from "@/components/home/Hero";
import CompletedProjects from "@/components/work/CompletedProjects";
import InsideOsdo from "@/components/home/InsideOsdo";
import Approach from "@/components/home/Approach";
import ContactBand from "@/components/home/ContactBand";
import { featuredProjects, projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <CompletedProjects projects={featuredProjects} total={projects.length} showAllLink />
      <InsideOsdo />
      <Approach />
      <ContactBand />
    </>
  );
}
