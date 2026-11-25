import type { Media, Project, ProjectBlock } from "@/content/types";
import { orientationOf } from "@/content/projects";

/**
 * Builds a project page layout from its media when no hand-authored `blocks`
 * exist. Reads orientations so portraits pair up, landscapes alternate
 * between full-bleed and inset, and a run of three portraits becomes a trio.
 * `seed` (the project's position) shifts the rhythm so pages differ.
 */
export function composeBlocks(project: Project, seed = 0): ProjectBlock[] {
  if (project.blocks?.length) return project.blocks;
  const rest = project.media.filter((m) => m !== project.cover);
  const out: ProjectBlock[] = [];
  let landscapeTurn = seed % 2;
  let insetSide: "left" | "right" = seed % 2 ? "right" : "left";
  const flip = () => (insetSide = insetSide === "left" ? "right" : "left");
  const upright = (m?: Media) => !!m && m.kind !== "video" && orientationOf(m) !== "landscape";

  for (let i = 0; i < rest.length; ) {
    const m = rest[i];
    if (m.kind === "video") {
      out.push({ type: "video", media: m });
      i += 1;
    } else if (orientationOf(m) === "landscape") {
      if (landscapeTurn++ % 2 === 0) out.push({ type: "full", media: m });
      else {
        out.push({ type: "inset", media: m, align: insetSide });
        flip();
      }
      i += 1;
    } else if (upright(rest[i + 1]) && upright(rest[i + 2]) && (seed + i) % 2 === 0) {
      out.push({ type: "trio", media: [m, rest[i + 1], rest[i + 2]] });
      i += 3;
    } else if (upright(rest[i + 1])) {
      out.push({ type: "pair", media: [m, rest[i + 1]] });
      i += 2;
    } else {
      out.push({ type: "inset", media: m, align: insetSide });
      flip();
      i += 1;
    }
    if (out.length === 1 && project.summary) out.push({ type: "text", text: project.summary });
  }
  return out;
}
