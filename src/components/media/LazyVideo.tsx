"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoMedia } from "@/content/types";

/**
 * Muted, inline video that only loads and plays while on screen, so the page
 * never runs more than the visible film. Visitors can pause it; reduced-motion
 * visitors start paused on the poster.
 */
export default function LazyVideo({ media, controls = true }: { media: VideoMedia; controls?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>();
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) userPaused.current = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc(media.src);
          if (!userPaused.current) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [media.src]);

  useEffect(() => {
    const v = ref.current;
    if (v && src && !userPaused.current) v.play().catch(() => {});
  }, [src]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      if (!src) setSrc(media.src);
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={media.poster}
        muted
        playsInline
        loop={media.loop ?? true}
        preload="none"
        aria-label={media.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ objectFit: "cover", objectPosition: media.focus ?? "50% 50%" }}
      />
      {controls ? (
        <button type="button" className="film-btn" onClick={toggle} aria-label={playing ? "Pause film" : "Play film"}>
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
            {playing ? <path d="M1 0h3v12H1zM6 0h3v12H6z" fill="currentColor" /> : <path d="M0 0l10 6-10 6z" fill="currentColor" />}
          </svg>
          {playing ? "Pause" : "Play"}
        </button>
      ) : null}
    </>
  );
}
