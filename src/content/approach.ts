import type { Media } from "./types";

/**
 * DESIGN APPROACH
 *
 * Structure only. Stage names follow the brief's suggested "sketch to
 * structure" idea and are placeholders until OSDO describes its own process
 * and supplies sketches, drawings, material studies and photographs.
 */
export type Stage = { key: string; title: string; media: Media; isPlaceholder?: boolean };

const base = { width: 1600, height: 1100, status: "placeholder" as const };

export const stages: Stage[] = [
  {
    key: "sketch",
    title: "Sketch",
    isPlaceholder: true,
    media: { ...base, kind: "placeholder", tone: "ivory", drawing: "axo", label: "Placeholder\nConcept sketch", alt: "Placeholder for a concept sketch" },
  },
  {
    key: "drawing",
    title: "Drawing",
    isPlaceholder: true,
    media: { ...base, kind: "placeholder", tone: "stone", drawing: "plan", label: "Placeholder\nPlans and sections", alt: "Placeholder for technical drawings" },
  },
  {
    key: "material",
    title: "Material",
    isPlaceholder: true,
    media: { ...base, kind: "placeholder", tone: "timber", drawing: "detail", label: "Placeholder\nMaterial study", alt: "Placeholder for a material study" },
  },
  {
    key: "space",
    title: "Space",
    isPlaceholder: true,
    media: { ...base, kind: "placeholder", tone: "olive", drawing: "section", label: "Placeholder\nCompleted space", alt: "Placeholder for a photograph of the completed space" },
  },
];
