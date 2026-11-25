import type { Media } from "./types";
import { residentialMedia as r } from "./projects";

/**
 * DESIGN APPROACH
 *
 * Told through one real project, using its own supplied material: the
 * existing and proposed plans of the Residential Transformation, then the
 * veranda before and after. No process is invented beyond what these show.
 */
export type Stage = { key: string; title: string; media: Media; isPlaceholder?: boolean };

export const approach = {
  title: ["From plan", "to space"],
  project: { title: "Residential Transformation", slug: "residential-transformation" },
};

export const stages: Stage[] = [
  { key: "existing", title: "Existing plan", media: r.planExisting },
  { key: "proposed", title: "Proposed plan", media: r.planProposed },
  { key: "before", title: "Before", media: r.b3 },
  { key: "after", title: "After", media: r.a2 },
];
