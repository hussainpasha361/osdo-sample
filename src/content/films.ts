/**
 * FILMS
 *
 * Reels from OSDO's Instagram for the "On film" section. Each film is a
 * muted, looping MP4 (H.264, faststart) with a poster frame. Screen
 * recordings must be cropped to remove the Instagram interface before use;
 * originals go in /assets/originals/films. Order here is display order.
 */
export type Film = {
  id: string;
  title: string;
  /** Omit src for a slot still waiting for footage; it renders as a labelled placeholder. */
  src?: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
  status: "final" | "provisional" | "placeholder";
};

export const films: Film[] = [
  {
    id: "studio",
    title: "Welcome to OSDO",
    src: "/media/studio/office-reel.mp4",
    poster: "/media/studio/office-reel-poster.jpg",
    width: 332,
    height: 488,
    alt: "A walk through the OSDO studio: timber joinery, steel shelving, planters and warm light.",
    status: "provisional",
  },
  {
    id: "reel-2",
    title: "Film to come",
    width: 1080,
    height: 1920,
    alt: "Placeholder for an OSDO reel",
    status: "placeholder",
  },
];
