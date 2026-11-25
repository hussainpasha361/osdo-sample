import type { Metadata } from "next";
import CompletedProjects from "@/components/work/CompletedProjects";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Completed Projects" };

export default function WorkPage() {
  return (
    <div className="pt-[calc(var(--nav-h)-40px)]">
      <CompletedProjects projects={projects} headingLevel="h1" id="archive" />
    </div>
  );
}
