import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { StoryLines } from "../StoryLines";
import { message } from "../../content/message.config";
import type { Branch } from "../../types/content";
import {
  actionButtonHover,
  actionButtonHoverReduced,
  actionButtonTap,
  actionButtonTapReduced,
  appreciationButtonStyle,
  ctaHidden,
  ctaTransition,
  ctaTransitionReduced,
  ctaVisible,
  storyActionButtonBaseClassName,
  storySequenceAnimate,
  storySequenceExit,
  storySequenceExitReduced,
  storySequenceInitial,
  storySequenceTransition,
  storySequenceTransitionReduced,
} from "../motion/storyTextMotion";

export function FinalMessage({ branch, onReturnToChoice }: { branch: Branch; onReturnToChoice: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [appreciationComplete, setAppreciationComplete] = useState(false);
  const [secondaryComplete, setSecondaryComplete] = useState(false);
  const { appreciation, coffee } = message.finalMessage;
  const shouldReduceMotion = useReducedMotion();

  const localTransition = shouldReduceMotion ? storySequenceTransitionReduced : storySequenceTransition;
  const localExit = shouldReduceMotion ? storySequenceExitReduced : storySequenceExit;

  return (
    <div className="flex w-full max-w-2xl items-center justify-center py-8">
      <AnimatePresence mode="wait">
        {branch === null && (
          <motion.p
            key="waiting"
            className="font-serif-letter text-base md:text-lg text-center"
            style={{ color: "var(--color-lavender-mist)" }}
            initial={storySequenceInitial}
            animate={{ opacity: 0.7 }}
            exit={localExit}
            transition={localTransition}
          >
            Waiting for your answer above.
          </motion.p>
        )}

        {branch === "coffee" && (
          <motion.div
            key="coffee"
            initial={storySequenceInitial}
            animate={storySequenceAnimate}
            exit={localExit}
            transition={localTransition}
          >
            <StoryLines lines={coffee.lines} />
          </motion.div>
        )}

        {branch === "appreciation" && !revealed && (
          <motion.div
            key="appreciation"
            className="flex flex-col items-center gap-10"
            initial={storySequenceInitial}
            animate={storySequenceAnimate}
            exit={localExit}
            transition={localTransition}
          >
            <StoryLines lines={appreciation.lines} onRevealComplete={() => setAppreciationComplete(true)} />

            {/* A genuine confirm-style prompt, not a "keep reading" link —
                same filled pill-button language as the two main choices
                (lavender family, since this whole flow is the appreciation
                branch), just fading in on the same timing as before. */}
            <motion.button
              type="button"
              onClick={() => setRevealed(true)}
              tabIndex={appreciationComplete ? 0 : -1}
              aria-hidden={!appreciationComplete}
              className={`story-btn-lavender ${storyActionButtonBaseClassName}`}
              style={{
                ...appreciationButtonStyle,
                pointerEvents: appreciationComplete ? "auto" : "none",
              }}
              initial={ctaHidden}
              animate={appreciationComplete ? ctaVisible : ctaHidden}
              transition={shouldReduceMotion ? ctaTransitionReduced : ctaTransition}
              whileHover={shouldReduceMotion ? actionButtonHoverReduced : actionButtonHover}
              whileTap={shouldReduceMotion ? actionButtonTapReduced : actionButtonTap}
            >
              {appreciation.secondaryPrompt}
            </motion.button>
          </motion.div>
        )}

        {branch === "appreciation" && revealed && (
          <motion.div
            key="appreciation-reveal"
            className="flex flex-col items-center gap-8"
            initial={storySequenceInitial}
            animate={storySequenceAnimate}
            exit={localExit}
            transition={localTransition}
          >
            <StoryLines lines={appreciation.secondaryReveal} onRevealComplete={() => setSecondaryComplete(true)} />
            <motion.button
              type="button"
              onClick={onReturnToChoice}
              tabIndex={secondaryComplete ? 0 : -1}
              aria-hidden={!secondaryComplete}
              className={`story-btn-lavender ${storyActionButtonBaseClassName}`}
              style={{
                ...appreciationButtonStyle,
                pointerEvents: secondaryComplete ? "auto" : "none",
              }}
              initial={ctaHidden}
              animate={secondaryComplete ? ctaVisible : ctaHidden}
              transition={shouldReduceMotion ? ctaTransitionReduced : ctaTransition}
              whileHover={shouldReduceMotion ? actionButtonHoverReduced : actionButtonHover}
              whileTap={shouldReduceMotion ? actionButtonTapReduced : actionButtonTap}
            >
              {appreciation.backButtonLabel}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
