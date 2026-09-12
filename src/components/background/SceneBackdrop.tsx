import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Scene } from "../../types/content";
import { sceneImages } from "../../content/sceneImages";

const CROSSFADE_DURATION = 0.85;
const CROSSFADE_DURATION_REDUCED = 0.2;

export interface PhotoRect {
  width: number;
  height: number;
}

// One photo layer: a solid local backdrop fill (covers any letterbox gap
// from the image's own aspect ratio) with the actual photo contained
// inside it, never cropped, never stretched, never blurred.
function PhotoLayer({ scene }: { scene: Scene }) {
  const images = sceneImages[scene];
  if (!images) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-black)" }}
    >
      <picture className="flex h-full w-full items-center justify-center">
        <source media="(min-width: 768px)" srcSet={images.desktop} />
        <img src={images.mobile} alt="" className="max-h-full max-w-full object-contain" />
      </picture>
    </div>
  );
}

// Measures the ACTUAL rendered rectangle of the current scene's
// object-fit: contain photo — not a CSS approximation. A single instance,
// deliberately outside the AnimatePresence crossfade below (which can keep
// an outgoing layer mounted mid-exit with stale props): this remounts
// cleanly the instant `scene` changes, so there's never a stale/ambiguous
// "which layer do I measure" question. Invisible — this exists purely for
// geometry, the visible photo is the AnimatePresence layer below.
function PhotoRectMeasurer({ scene, onRectChange }: { scene: Scene; onRectChange: (rect: PhotoRect | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const images = sceneImages[scene];

  useEffect(() => {
    if (!images) {
      onRectChange(null);
      return;
    }

    const computeRect = () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img || !img.naturalWidth || !img.naturalHeight) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;

      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = cw / ch;

      // Same math the browser uses internally for object-fit: contain.
      const width = naturalAspect > containerAspect ? cw : ch * naturalAspect;
      const height = naturalAspect > containerAspect ? cw / naturalAspect : ch;

      onRectChange({ width, height });
    };

    const img = imgRef.current;
    if (img?.complete) computeRect();
    img?.addEventListener("load", computeRect);
    window.addEventListener("resize", computeRect);
    window.addEventListener("orientationchange", computeRect);

    let resizeObserver: ResizeObserver | undefined;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(computeRect);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      img?.removeEventListener("load", computeRect);
      window.removeEventListener("resize", computeRect);
      window.removeEventListener("orientationchange", computeRect);
      resizeObserver?.disconnect();
    };
  }, [scene, images, onRectChange]);

  if (!images) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 opacity-0" style={{ pointerEvents: "none" }} aria-hidden="true">
      <picture className="flex h-full w-full items-center justify-center">
        <source media="(min-width: 768px)" srcSet={images.desktop} />
        <img ref={imgRef} src={images.mobile} alt="" className="max-h-full max-w-full object-contain" />
      </picture>
    </div>
  );
}

// The photograph "environment" behind a scene. Crossfades between scenes —
// outgoing opacity 1→0, incoming 0→1, both layers stacked so the pure black
// base (body background) is never exposed as a purple/blue flash mid-
// transition — and is otherwise completely stable: no independent
// blur/scale/slide, ever. AnimatePresence's default (overlapping) mode is
// what gives the actual crossfade; StoryScene's own text blur/fade is
// unrelated and never touches this layer.
export function SceneBackdrop({ scene, onRectChange }: { scene: Scene; onRectChange: (rect: PhotoRect | null) => void }) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? CROSSFADE_DURATION_REDUCED : CROSSFADE_DURATION;

  return (
    <div className="fixed inset-0" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: "easeInOut" }}
        >
          <PhotoLayer scene={scene} />
        </motion.div>
      </AnimatePresence>
      <PhotoRectMeasurer scene={scene} onRectChange={onRectChange} />
    </div>
  );
}
