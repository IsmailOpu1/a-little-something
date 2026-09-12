import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "../../content/message.config";
import { StoryContinue } from "../StoryContinue";
import { StoryTextBeat } from "../motion/StoryTextBeat";
import { StoryTypewriterLine } from "../motion/StoryTypewriterLine";
import {
  ctaHidden,
  ctaTransition,
  ctaVisible,
  postRevealPause,
  storyButtonClassName,
  storyButtonStyle,
  storySequenceAnimate,
  storySequenceExit,
  storySequenceInitial,
  storySequenceTransition,
} from "../motion/storyTextMotion";

export function Opening({ onContinue, onOpen }: { onContinue: () => void; onOpen?: () => void }) {
  const [opened, setOpened] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [showOpenCta, setShowOpenCta] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  // "OPEN THIS →" only starts fading in once the closed-gate text has
  // actually finished its apparition, after the same breathing pause every
  // other Continue-style affordance in the site waits for — never on a
  // fixed timer that could land while text is still revealing.
  useEffect(() => {
    if (!introComplete) return;

    const timeout = window.setTimeout(() => setShowOpenCta(true), postRevealPause);
    return () => window.clearTimeout(timeout);
  }, [introComplete]);

  useEffect(() => {
    if (!isComplete) return;

    const timeout = window.setTimeout(() => setShowContinue(true), postRevealPause);
    return () => window.clearTimeout(timeout);
  }, [isComplete]);

  const handleOpen = () => {
    setOpened(true);
    // The click itself is the real user gesture that's allowed to start
    // audio playback — see App's useBackgroundMusic.
    onOpen?.();
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-10">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button
            key="closed"
            type="button"
            onClick={handleOpen}
            className="story-open-card flex flex-col items-center gap-10 cursor-pointer bg-transparent border-none"
            initial={storySequenceInitial}
            animate={storySequenceAnimate}
            exit={storySequenceExit}
            transition={storySequenceTransition}
          >
            <div className="flex flex-col items-center gap-3">
              {message.opening.initialLines.map((line, index) => (
                <StoryTextBeat
                  key={line.text}
                  index={index}
                  className="max-w-md font-serif-letter text-xl leading-relaxed md:text-2xl"
                  style={{ color: index === 1 ? "var(--color-lavender-mist)" : "var(--color-warm-white)" }}
                  onAnimationComplete={
                    index === message.opening.initialLines.length - 1
                      ? () => setIntroComplete(true)
                      : undefined
                  }
                >
                  {line.text}
                </StoryTextBeat>
              ))}
            </div>

            {/* "OPEN THIS →" matches Continue's pill-button treatment. Still
                a span (not a nested <button>) since the whole card above is
                already the clickable element — its hover/press feedback is
                therefore driven by the parent's pseudo-classes
                (.story-open-card in index.css), and whileHover/whileTap
                above lift the whole card slightly rather than just the
                pill. Visibility is driven by introComplete (the last
                closed-gate line finishing + a breathing pause), never a
                fixed mount-relative timer. */}
            <motion.span
              className={`story-open-pill ${storyButtonClassName}`}
              style={{ ...storyButtonStyle, pointerEvents: "none" }}
              initial={ctaHidden}
              animate={showOpenCta ? ctaVisible : ctaHidden}
              transition={ctaTransition}
            >
              {message.opening.ctaText}
            </motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="opened"
            className="flex flex-col items-center gap-10"
            initial={storySequenceInitial}
            animate={storySequenceAnimate}
            exit={storySequenceExit}
            transition={storySequenceTransition}
          >
            <StoryTypewriterLine
              text={message.opening.revealLine}
              className="font-serif-letter text-xl md:text-2xl max-w-md"
              style={{ color: "var(--color-warm-white)" }}
              onComplete={() => setIsComplete(true)}
            />
            <StoryContinue visible={showContinue} onClick={onContinue} label="Continue →" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
