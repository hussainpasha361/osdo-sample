import type { Media } from "./types";

/**
 * INSIDE OSDO
 *
 * The office photographs and reel are genuine OSDO material, taken from
 * Instagram screenshots supplied by the client: carousel counters cropped out,
 * lightly sharpened, colours untouched. Originals live in /assets/originals.
 * Status "provisional" until full-resolution files replace them.
 */

export const studioFilm: Media = {
  kind: "video",
  src: "/media/studio/office-reel.mp4",
  poster: "/media/studio/office-reel-poster.jpg",
  width: 332,
  height: 488,
  alt: "A walk through the OSDO studio: timber joinery, steel shelving, planters and warm lighting.",
  loop: true,
  status: "provisional",
};

export const studioPhotos: Media[] = [
  {
    kind: "image",
    src: "/media/studio/office-arch.jpg",
    width: 1150,
    height: 1430,
    alt: "An arched opening into the studio pantry, a potted palm casting leaf shadows on the wall.",
    status: "provisional",
  },
  {
    kind: "image",
    src: "/media/studio/office-shelving.jpg",
    width: 1179,
    height: 1436,
    alt: "Black steel shelving over oak cabinets, lit by a woven pendant.",
    status: "provisional",
  },
  {
    kind: "image",
    src: "/media/studio/office-door.jpg",
    width: 1179,
    height: 1437,
    alt: "A corridor with fluted walls and a steel-framed glass partition leading to an olive green door.",
    focus: "50% 40%",
    status: "provisional",
  },
  {
    kind: "image",
    src: "/media/studio/office-desk.jpg",
    width: 1179,
    height: 1430,
    alt: "A desk corner beside planters, vertical blinds and a timber bench.",
    status: "provisional",
  },
];
