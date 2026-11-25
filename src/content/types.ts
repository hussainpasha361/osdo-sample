/**
 * Content model. Every component reads from these shapes, so swapping
 * placeholders for real OSDO assets is a data change, not a design change.
 */

export type Orientation = "portrait" | "landscape" | "square";

/** Tones used by generated placeholder plates (see components/media/Placeholder). */
export type PlateTone = "stone" | "timber" | "olive" | "ivory" | "charcoal" | "orange";
export type PlateDrawing = "plan" | "section" | "elevation" | "axo" | "detail" | "site";

type MediaBase = {
  /** Intrinsic size, used for aspect ratio and to prevent layout shift. */
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Object position for crops, e.g. "50% 30%". */
  focus?: string;
  /**
   * Provenance flag. `placeholder` = generated plate, `temporary` = stand-in
   * imagery that is not confirmed OSDO work, `provisional` = genuine OSDO
   * material awaiting a higher-quality original, `final` = approved.
   */
  status: "placeholder" | "temporary" | "provisional" | "final";
};

export type ImageMedia = MediaBase & { kind: "image"; src: string };
export type VideoMedia = MediaBase & { kind: "video"; src: string; poster?: string; loop?: boolean };
export type PlaceholderMedia = MediaBase & {
  kind: "placeholder";
  tone: PlateTone;
  drawing: PlateDrawing;
  /** Text printed on the plate so placeholders are unmistakable in review. */
  label: string;
};

export type Media = ImageMedia | VideoMedia | PlaceholderMedia;

/**
 * Optional explicit layout for a project page. When omitted, the page composes
 * a layout automatically from the media orientations (lib/compose.ts).
 */
export type ProjectBlock =
  | { type: "full"; media: Media }
  | { type: "inset"; media: Media; align?: "left" | "right" }
  | { type: "pair"; media: [Media, Media] }
  | { type: "trio"; media: [Media, Media, Media] }
  | { type: "drawing"; media: Media; note?: string }
  | { type: "video"; media: Media }
  | { type: "text"; text: string };

export type Project = {
  slug: string;
  /** Display number, e.g. "01". Derived from order when omitted. */
  number?: string;
  title: string;
  /** Short facts. Leave undefined until OSDO confirms them; nothing is invented. */
  category?: string;
  location?: string;
  year?: string;
  area?: string;
  credits?: { label: string; value: string }[];
  /** One or two sentences at most. Optional. */
  summary?: string;
  cover: Media;
  /** All project media in preferred order. */
  media: Media[];
  /** Optional hand-authored layout; overrides the automatic composition. */
  blocks?: ProjectBlock[];
  /** Featured projects appear on the homepage exhibition. */
  featured?: boolean;
  isPlaceholder?: boolean;
};

/** Line drawing aligned to a photograph, in the photo's pixel coordinates. */
export type Drawing = {
  width: number;
  height: number;
  /** Primary linework, drawn first. */
  lines: string[];
  /** Hidden / construction lines, drawn dashed. */
  hidden?: string[];
  /** Organic linework (planting, soft furnishings), drawn lighter. */
  soft?: string[];
  /** Grid references and datums extending past the frame. */
  grid?: { axis: "x" | "y"; at: number; label: string }[];
  /** Point annotations, shown as small markers with a word. */
  notes?: { x: number; y: number; label: string }[];
};
