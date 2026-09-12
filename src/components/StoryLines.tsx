import { useEffect, useRef, useState } from "react";
import type { StoryLine } from "../types/content";
import { StoryTypewriterLine } from "./motion/StoryTypewriterLine";
import {
  postRevealPause,
  typewriterLineGap,
  storyPanelClassName,
  storyPanelStyle,
  storyPanelTextShadow,
} from "./motion/storyTextMotion";

// Renders the narrative beats for one scene. This is a plain (non-animated)
// container — the scene-level fade already comes from StoryScene. Lines
// type out sequentially, one at a time, each keeping its own line break:
// only the current line is mounted and typing; already-typed lines stay
// rendered in full; lines not yet reached aren't rendered at all.
interface StoryLinesProps {
  lines: StoryLine[];
  onRevealComplete?: () => void;
  // When true, every line renders already-typed from first paint instead
  // of running the typewriter — for revisiting a scene the reader has
  // already read once (e.g. "Back to the two options").
  instant?: boolean;
}

export function StoryLines({ lines, onRevealComplete, instant = false }: StoryLinesProps) {
  const [activeIndex, setActiveIndex] = useState(instant ? lines.length : 0);
  const [justCompletedIndex, setJustCompletedIndex] = useState<number | null>(null);
  const [hasRevealed, setHasRevealed] = useState(instant);
  const completionRef = useRef(onRevealComplete);

  useEffect(() => {
    completionRef.current = onRevealComplete;
  }, [onRevealComplete]);

  // Short pause after a line finishes typing before the next one starts —
  // gives each sentence a breath, same idea as the stagger it replaces.
  useEffect(() => {
    if (justCompletedIndex === null) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex(justCompletedIndex + 1);
      setJustCompletedIndex(null);
    }, typewriterLineGap);
    return () => window.clearTimeout(timeout);
  }, [justCompletedIndex]);

  useEffect(() => {
    if (!hasRevealed || !completionRef.current) return;

    const timeout = window.setTimeout(completionRef.current, instant ? 0 : postRevealPause);
    return () => window.clearTimeout(timeout);
  }, [hasRevealed, instant]);

  const lineClassName = (line: StoryLine) =>
    line.emphasis
      ? "font-serif-letter text-xl md:text-2xl text-center"
      : "font-serif-letter text-base md:text-lg text-center";

  const lineStyle = (line: StoryLine) => ({
    color: line.emphasis ? "var(--color-soft-pink)" : "var(--color-warm-white)",
  });

  const handleLineComplete = (i: number) => {
    if (i === lines.length - 1) {
      setHasRevealed(true);
    } else {
      setJustCompletedIndex(i);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 md:gap-4">
      {lines.map((line, i) => {
        if (i > activeIndex) return null;

        if (i < activeIndex) {
          // Already typed — render statically, no re-animation, same panel.
          return (
            <div key={i} className={storyPanelClassName} style={storyPanelStyle}>
              <p className={lineClassName(line)} style={{ ...lineStyle(line), textShadow: storyPanelTextShadow }}>
                {line.text}
              </p>
            </div>
          );
        }

        return (
          <StoryTypewriterLine
            key={i}
            text={line.text}
            className={lineClassName(line)}
            style={lineStyle(line)}
            onComplete={() => handleLineComplete(i)}
          />
        );
      })}
    </div>
  );
}
