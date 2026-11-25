import type { Media, Orientation, PlateDrawing, PlateTone, Project } from "./types";

/**
 * COMPLETED PROJECTS
 *
 * Development placeholders only. Each entry stands in for a real OSDO project
 * and deliberately carries no name, place, date or client. To add a real
 * project, append an object with real `title`, `cover` and `media` (status
 * "final") and remove the matching placeholder. Order here is display order.
 */

const SIZE: Record<Orientation, [number, number]> = {
  portrait: [1200, 1500],
  landscape: [1800, 1200],
  square: [1400, 1400],
};
const TONES: PlateTone[] = ["stone", "timber", "olive", "ivory", "charcoal", "orange"];
const DRAWINGS: PlateDrawing[] = ["elevation", "plan", "section", "axo", "detail", "site"];

function plate(project: number, index: number, total: number, o: Orientation, seed: number): Media {
  const [width, height] = SIZE[o];
  const n = String(project).padStart(2, "0");
  return {
    kind: "placeholder",
    width,
    height,
    tone: TONES[(seed + index * 2) % TONES.length],
    drawing: DRAWINGS[(seed + index) % DRAWINGS.length],
    label: `Placeholder image\nProject ${n}, ${index + 1} of ${total}, ${o}`,
    alt: `Placeholder image ${index + 1} for project ${n}`,
    status: "placeholder",
  };
}

/** Orientation sequences vary per project so templates are exercised properly. */
const SEQUENCES: Orientation[][] = [
  ["landscape", "portrait", "portrait", "landscape", "portrait", "landscape", "square", "portrait", "portrait"],
  ["portrait", "landscape", "landscape", "portrait", "portrait", "portrait", "landscape"],
  ["landscape", "landscape", "portrait", "square", "portrait", "landscape"],
  ["portrait", "portrait", "landscape", "portrait", "landscape", "portrait", "portrait", "landscape", "landscape", "portrait"],
  ["landscape", "portrait", "landscape", "portrait", "portrait"],
  ["square", "landscape", "portrait", "portrait", "landscape", "portrait", "landscape", "landscape"],
];

function placeholderProject(i: number): Project {
  const seq = SEQUENCES[i % SEQUENCES.length];
  const n = String(i + 1).padStart(2, "0");
  const media = seq.map((o, k) => plate(i + 1, k, seq.length, o, i));
  return {
    slug: `project-${n}`,
    title: `Project ${n}`,
    cover: media[0],
    media,
    featured: i < 4,
    isPlaceholder: true,
  };
}

export const projects: Project[] = Array.from({ length: 6 }, (_, i) => placeholderProject(i)).map((p, i) => ({
  ...p,
  number: p.number ?? String(i + 1).padStart(2, "0"),
}));

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Previous and next, wrapping around the archive. */
export function getNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const len = projects.length;
  return { prev: projects[(i - 1 + len) % len], next: projects[(i + 1) % len] };
}

export function orientationOf(m: Media): Orientation {
  const r = m.width / m.height;
  if (r > 1.1) return "landscape";
  if (r < 0.9) return "portrait";
  return "square";
}
