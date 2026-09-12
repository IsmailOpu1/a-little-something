import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  textBeatDuration,
  textBeatDurationReduced,
  textBeatStagger,
  textBeatStaggerReduced,
  storyPanelClassName,
  storyPanelStyle,
  storyPanelTextShadow,
} from "./storyTextMotion";

interface StoryTextBeatProps {
  children: ReactNode;
  index: number;
  className: string;
  style?: CSSProperties;
  onAnimationComplete?: () => void;
}

// Stagger is capped at this index so total text apparition time stays
// ~2.25s (max delay 1.35s + 0.9s duration) no matter how many lines a
// scene has — lines beyond the cap begin together with the capped line
// instead of pushing the reveal further out.
const MAX_STAGGER_INDEX = 3;

// The Opening's original text entrance is the single motion source for every
// narrative beat: 10px below, 4px soft focus, soft ease-out, comfortable
// reading-pace stagger (see storyTextMotion.ts for the exact numbers). The
// panel wrapper is static — only the text inside blurs/rises in — matching
// the same "panel doesn't animate" treatment as the typewriter lines.
export function StoryTextBeat({ children, index, className, style, onAnimationComplete }: StoryTextBeatProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={storyPanelClassName} style={storyPanelStyle}>
      <motion.p
        className={className}
        style={{ ...style, textShadow: storyPanelTextShadow }}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: shouldReduceMotion ? textBeatDurationReduced : textBeatDuration,
          delay: Math.min(index, MAX_STAGGER_INDEX) * (shouldReduceMotion ? textBeatStaggerReduced : textBeatStagger),
          ease: "easeOut",
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.p>
    </div>
  );
}
