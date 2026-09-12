import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StoryLines } from "../StoryLines";
import { Snowfall } from "../effects/Snowfall";
import { message } from "../../content/message.config";
import type { Branch } from "../../types/content";
import {
  actionButtonHover,
  actionButtonHoverReduced,
  actionButtonTap,
  actionButtonTapReduced,
  appreciationButtonStyle,
  coffeeButtonStyle,
  ctaHidden,
  ctaTransition,
  ctaTransitionReduced,
  ctaVisible,
  storyActionButtonBaseClassName,
} from "../motion/storyTextMotion";

interface NoExpectationsProps {
  branch: Branch;
  onChoose: (branch: Exclude<Branch, null>) => void;
  // When true, the lines above render already-typed instead of running the
  // typewriter — used when the reader is returning here after already
  // having read it once (see App's onReturnToChoice).
  instant?: boolean;
}

export function NoExpectations({ branch, onChoose, instant = false }: NoExpectationsProps) {
  const { choices } = message.noExpectations;
  const [isComplete, setIsComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  void branch; // no longer changes these buttons' appearance — see note below

  return (
    <>
      {/* This is the ONLY place Snowfall is rendered — scoped entirely to
          this scene. It's a fixed, full-viewport, non-interactive layer;
          z-10 on the content wrapper below keeps text/buttons reliably on
          top of it regardless of DOM order. */}
      <Snowfall />
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-12 py-8">
        <StoryLines lines={message.noExpectations.lines} onRevealComplete={() => setIsComplete(true)} instant={instant} />

        {/* Always mounted — reserves its space from first paint — so its
            appearance never shifts the settled text above it. Both choices
            are always fully filled with their own gradient (not just on
            selection) so they read as prominent, real actions from the
            moment they appear. Stacks vertically until sm:, then sits side
            by side — no horizontal overflow at narrow widths. */}
        <div className="flex w-full max-w-sm flex-col justify-center gap-4 sm:max-w-lg sm:flex-row">
          <motion.button
            type="button"
            onClick={() => onChoose("appreciation")}
            tabIndex={isComplete ? 0 : -1}
            aria-hidden={!isComplete}
            className={`story-btn-lavender flex-1 ${storyActionButtonBaseClassName}`}
            style={{
              ...appreciationButtonStyle,
              pointerEvents: isComplete ? "auto" : "none",
            }}
            initial={ctaHidden}
            animate={isComplete ? ctaVisible : ctaHidden}
            transition={{
              ...(shouldReduceMotion ? ctaTransitionReduced : ctaTransition),
              delay: isComplete ? 0.15 : 0,
            }}
            whileHover={shouldReduceMotion ? actionButtonHoverReduced : actionButtonHover}
            whileTap={shouldReduceMotion ? actionButtonTapReduced : actionButtonTap}
          >
            {choices.appreciationLabel}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onChoose("coffee")}
            tabIndex={isComplete ? 0 : -1}
            aria-hidden={!isComplete}
            className={`story-btn-coffee flex-1 ${storyActionButtonBaseClassName}`}
            style={{
              ...coffeeButtonStyle,
              pointerEvents: isComplete ? "auto" : "none",
            }}
            initial={ctaHidden}
            animate={isComplete ? ctaVisible : ctaHidden}
            transition={shouldReduceMotion ? ctaTransitionReduced : ctaTransition}
            whileHover={shouldReduceMotion ? actionButtonHoverReduced : actionButtonHover}
            whileTap={shouldReduceMotion ? actionButtonTapReduced : actionButtonTap}
          >
            {choices.coffeeLabel}
          </motion.button>
        </div>
      </div>
    </>
  );
}
