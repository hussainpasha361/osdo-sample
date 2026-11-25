import type { Media, Project, ProjectBlock } from "@/content/types";
import { FULL_BLEED_MIN, orientationOf } from "@/content/projects";

/**
 * Builds a project page layout from its media when no hand-authored `blocks`
 * exist:
 * - consecutive plans gather on one sheet of paper (never cropped);
 * - landscapes alternate between full-bleed and inset, but only images at
 *   least FULL_BLEED_MIN wide may go edge to edge;
 * - portraits and squares pair up, and runs of three become a trio;
 * - `seed` (the project's position) shifts the rhythm so pages differ.
 */
export function composeBlocks(project: Project, seed = 0): ProjectBlock[] {
  if (project.blocks?.length) return project.blocks;
  const rest = project.media.filter((m) => m !== project.cover);
  const out: ProjectBlock[] = [];
  let landscapeTurn = seed % 2;
  let insetSide: "left" | "right" = seed % 2 ? "right" : "left";
  const flip = () => (insetSide = insetSide === "left" ? "right" : "left");
  const upright = (m?: Media) => !!m && m.kind !== "video" && m.role !== "plan" && orientationOf(m) !== "landscape";

  if (project.summary) out.push({ type: "text", text: project.summary });

  for (let i = 0; i < rest.length; ) {
    const m = rest[i];
    if (m.role === "plan") {
      const plans: Media[] = [];
      while (rest[i]?.role === "plan") plans.push(rest[i++]);
      out.push(plans.length === 1 ? { type: "drawing", media: plans[0] } : { type: "plans", media: plans });
    } else if (m.kind === "video") {
      out.push({ type: "video", media: m });
      i += 1;
    } else if (orientationOf(m) === "landscape") {
      if (m.width >= FULL_BLEED_MIN && landscapeTurn++ % 2 === 0) out.push({ type: "full", media: m });
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
  }
  return out;
}
