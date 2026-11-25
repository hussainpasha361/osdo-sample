import Image from "next/image";
import type { Media as M } from "@/content/types";
import Placeholder from "./Placeholder";
import LazyVideo from "./LazyVideo";

/**
 * One component for every image, video and placeholder on the site.
 * - `ratio` overrides the intrinsic aspect ratio (e.g. "4/5") for art-directed crops.
 * - `fill` makes it fill a sized parent instead.
 */
export default function Media({
  media,
  sizes = "100vw",
  priority = false,
  ratio,
  fill = false,
  className = "",
  showLabel = true,
  fit,
}: {
  media: M;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
  fill?: boolean;
  className?: string;
  showLabel?: boolean;
  /** Drawings default to "contain" whenever they are framed to another ratio, so plans are never cropped. */
  fit?: "cover" | "contain";
}) {
  const objectFit = fit ?? (media.role === "plan" && (ratio || fill) ? "contain" : "cover");
  const style: React.CSSProperties = {
    ...(fill ? { position: "absolute", inset: 0, height: "100%" } : { aspectRatio: ratio ?? `${media.width} / ${media.height}` }),
    ...(objectFit === "contain" && media.paper ? { background: media.paper } : null),
  };

  return (
    <div className={`media ${className}`} style={style} data-status={media.status}>
      {media.kind === "image" ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit, objectPosition: media.focus ?? "50% 50%" }}
        />
      ) : media.kind === "video" ? (
        <LazyVideo media={media} />
      ) : (
        <Placeholder media={media} showLabel={showLabel} />
      )}
    </div>
  );
}
