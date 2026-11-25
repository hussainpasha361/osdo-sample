import type { Drawing, Media } from "./types";
import { officeArchDrawing } from "./drawings/office-arch";
import { studioPhotos } from "./studio";

/**
 * HERO
 *
 * A photograph and a line drawing registered to it. Replace both together:
 * `photo` with the chosen project image, `drawing` with linework traced in
 * that image's pixel space. Until OSDO selects a hero project, the studio's
 * own arched pantry stands in (genuine OSDO material, provisional quality).
 */
export const hero: { photo: Media; drawing: Drawing; caption: string } = {
  photo: studioPhotos[0],
  drawing: officeArchDrawing,
  caption: "The OSDO studio",
};
