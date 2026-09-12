import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  typewriterCharDelay,
  typewriterCharDelayReduced,
  storyPanelClassName,
  storyPanelStyle,
  storyPanelTextShadow,
} from "./storyTextMotion";

interface StoryTypewriterLineProps {
  text: string;
  className: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

// Types `text` out one character at a time, starting as soon as it mounts.
// Used for the Opening's post-click reveal line and every StoryLines line —
// everywhere the block fade has been replaced with a real typewriter
// apparition. The Opening's closed-gate teaser lines are the one exception
// and keep using StoryTextBeat's blur/rise fade untouched.
//
// Characters are read via Array.from rather than raw string indexing so a
// two-code-unit character (e.g. an emoji) is never sliced mid-character.
export function StoryTypewriterLine({ text, className, style, onComplete }: StoryTypewriterLineProps) {
  const shouldReduceMotion = useReducedMotion();
  const characters = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);
  const completionRef = useRef(onComplete);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setCount(0);

    // Reduced motion types faster rather than skipping straight to the
    // full line — a delay always stays visible either way.
    const delay = shouldReduceMotion ? typewriterCharDelayReduced : typewriterCharDelay;

    let typed = 0;
    const interval = window.setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= characters.length) {
        window.clearInterval(interval);
        completionRef.current?.();
      }
    }, delay);

    return () => window.clearInterval(interval);
    // Intentionally re-runs only when the line itself or reduced-motion
    // preference changes, not on every onComplete identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters, shouldReduceMotion]);

  return (
    <div className={storyPanelClassName} style={storyPanelStyle}>
      <p className={className} style={{ ...style, textShadow: storyPanelTextShadow }}>
        {characters.slice(0, count).join("")}
      </p>
    </div>
  );
}
