import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  srcSmall: string;
  poster: string;
};

/**
 * Hero background video that picks a lightweight source on small/low-bandwidth
 * devices and keeps the loop seamless (no black flash on wrap-around).
 */
export function HeroVideo({ src, srcSmall, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 900px)").matches;
    const conn = (navigator as any).connection;
    const saveData = Boolean(conn?.saveData);
    const slow = /2g/.test(conn?.effectiveType ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || saveData || slow) return; // poster only
    setSource(smallScreen ? srcSmall : src);
  }, [src, srcSmall]);

  // Seamless loop: rewind just before the very last frame so the decoder never
  // shows an empty frame between iterations.
  useEffect(() => {
    const el = ref.current;
    if (!el || !source) return;
    const onTime = () => {
      if (el.duration && el.currentTime >= el.duration - 0.08) {
        el.currentTime = 0;
        void el.play().catch(() => {});
      }
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [source]);

  return (
    <video
      ref={ref}
      src={source ?? undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      width={1920}
      height={1080}
    />
  );
}
