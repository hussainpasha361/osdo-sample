import type { Metadata } from "next";
import CompletedProjects from "@/components/work/CompletedProjects";
import { completedProjects, flagship, studies } from "@/content/projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="pt-[calc(var(--nav-h)-40px)]">
      <CompletedProjects projects={completedProjects} headingLevel="h1" id="archive" flagshipSlug={flagship.slug} />
      {studies.length ? (
        <div className="border-t border-[var(--line)]">
          <CompletedProjects
            projects={studies}
            id="studies"
            title="Concepts & Design Studies"
            mark="B"
            note="Design visualisations and sample renders, kept apart from completed work."
          />
        </div>
      ) : null}
    </div>
  );
}
