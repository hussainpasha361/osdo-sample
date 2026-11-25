import type { Drawing, ImageMedia } from "./types";
import { officeArchDrawing } from "./drawings/office-arch";
import { officeShelvingDrawing } from "./drawings/office-shelving";
import { officeDoorDrawing } from "./drawings/office-door";
import { officeDeskDrawing } from "./drawings/office-desk";
import { studioPhotos } from "./studio";

/**
 * HERO
 *
 * Photographs paired with line drawings traced in each image's own pixel
 * space. `photo` + `drawing` lead the hero; `panes` join it as the frame
 * opens into four. Replace a photo and its drawing together. Genuine OSDO
 * studio material (provisional quality) until project images are chosen.
 */
export type DrawnPhoto = { photo: ImageMedia; drawing: Drawing };

const img = (i: number) => studioPhotos[i] as ImageMedia;

export const hero: DrawnPhoto & { caption: string; panes: DrawnPhoto[] } = {
  photo: img(0),
  drawing: officeArchDrawing,
  caption: "The OSDO studio",
  panes: [
    { photo: img(1), drawing: officeShelvingDrawing },
    { photo: img(2), drawing: officeDoorDrawing },
    { photo: img(3), drawing: officeDeskDrawing },
  ],
};
