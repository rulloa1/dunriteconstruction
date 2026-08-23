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
    const el = ref.current;
    if (!el) return;

    const smallScreen = window.matchMedia("(max-width: 900px)").matches;
    const conn = (navigator as any).connection;
    const saveData = Boolean(conn?.saveData);
    const slow = /2g/.test(conn?.effectiveType ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || saveData || slow) return; // poster only

    const chosen = smallScreen ? srcSmall : src;

    if (typeof IntersectionObserver === "undefined") {
      setSource(chosen);
      return;
    }

    // Only download + play once the hero is actually on screen; pause when it
    // scrolls away so the decoder isn't burning battery behind other sections.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSource((current) => current ?? chosen);
            void ref.current?.play().catch(() => {});
          } else {
            ref.current?.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
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
