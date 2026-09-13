import { motion } from "framer-motion";

interface SpeechBubbleHintProps {
  text: string;
  /** Which side the arrow curls toward, relative to the bubble */
  arrowSide?: "right" | "left";
  className?: string;
}

/**
 * A small dark speech-bubble with a curved, hand-drawn-style arrow,
 * meant to sit near a button and nudge the user toward an action
 * (e.g. "put your headphones on 🎧" next to a "Continue" button).
 *
 * Usage:
 *   <div className="relative inline-block">
 *     <button>Open this</button>
 *     <SpeechBubbleHint
 *       text="🎧 put your headphones in"
 *       className="absolute -top-16 left-1/2 -translate-x-1/2"
 *     />
 *   </div>
 */
export default function SpeechBubbleHint({
  text,
  arrowSide = "right",
  className = "",
}: SpeechBubbleHintProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      className={`pointer-events-none flex items-center gap-1 ${className}`}
    >
      {/* Bubble */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg whitespace-nowrap"
      >
        {text}
      </motion.div>

      {/* Curved arrow */}
      <svg
        width="48"
        height="40"
        viewBox="0 0 48 40"
        fill="none"
        className={arrowSide === "right" ? "" : "-scale-x-100"}
      >
        <path
          d="M2 4C16 4 34 8 40 24C42 29 40 33 36 35"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* arrowhead dot, mimics the reference image's rounded tip */}
        <circle cx="36" cy="35" r="3" fill="white" />
      </svg>
    </motion.div>
  );
}
