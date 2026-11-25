/**
 * FILMS
 *
 * Reels from OSDO's Instagram for the "On film" section. reel-2 and reel-3 are
 * placeholder cuts from screen recordings (Instagram interface cropped out);
 * replace them with the original exports when available. Each film is a
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
    title: "Guess the building",
    src: "/media/films/reel-02.mp4",
    poster: "/media/films/reel-02-poster.jpg",
    width: 340,
    height: 560,
    alt: "Two members of the studio play a guessing game about famous buildings across the meeting table.",
    status: "placeholder",
  },
  {
    id: "reel-3",
    title: "At the drawing table",
    src: "/media/films/reel-03.mp4",
    poster: "/media/films/reel-03-poster.jpg",
    width: 340,
    height: 560,
    alt: "The team sketches and annotates a design together around the studio table.",
    status: "placeholder",
  },
];
