import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { Scene } from "../types/content";
import { sceneAnchorClassName } from "../content/sceneLayout";
import type { PhotoRect } from "./background/SceneBackdrop";
import {
  storySequenceAnimate,
  storySequenceExit,
  storySequenceExitReduced,
  storySequenceInitial,
  storySequenceTransition,
  storySequenceTransitionReduced,
} from "./motion/storyTextMotion";

// Every top-level scene enters and exits through this component. It uses
// the exact same opacity/blur language as Opening's own closed→opened
// swap — no y-drift, no scale — so a scene transition never compounds with
// the per-line text motion happening inside it. The photograph backdrop
// lives entirely outside this component (see App/SceneBackdrop) and is
// never touched by this transition.
//
// Layout: the outer <motion.section> is a plain, non-scrolling, full-
// viewport frame — it only ever fades/blurs as a whole. Inside it, the
// content is bounded to `photoRect` — the ACTUAL measured rendered
// rectangle of the current scene's object-fit: contain photo (see
// SceneBackdrop's PhotoRectMeasurer) — centered the same way the photo
// itself is centered, so text can never spill into a letterbox/pillarbox
// area. Scenes with no photo (photoRect null, e.g. "expectations") fall
// back to the full viewport. The scrollable region lives INSIDE that
// bounded box, so long scenes scroll within the photo's own bounds and
// Continue stays reachable there — never in the black margin.
export function StoryScene({
  children,
  scene,
  photoRect,
}: {
  children: ReactNode;
  scene: Scene;
  photoRect: PhotoRect | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    scrollRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.section
      className="story-scene-frame absolute inset-0 overflow-hidden text-center"
      initial={storySequenceInitial}
      animate={storySequenceAnimate}
      exit={shouldReduceMotion ? storySequenceExitReduced : storySequenceExit}
      transition={shouldReduceMotion ? storySequenceTransitionReduced : storySequenceTransition}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="relative"
          style={photoRect ? { width: photoRect.width, height: photoRect.height } : { width: "100%", height: "100%" }}
        >
          <div
            ref={scrollRef}
            tabIndex={-1}
            aria-live="polite"
            className="story-scroll absolute inset-0 flex flex-col items-center overflow-y-auto overscroll-contain px-6 py-8 outline-none"
          >
            <div className={`flex w-full flex-col items-center ${sceneAnchorClassName(scene)}`}>{children}</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
