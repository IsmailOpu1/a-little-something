import { motion, useReducedMotion } from "framer-motion";
import {
  actionButtonHover,
  actionButtonHoverReduced,
  actionButtonTap,
  actionButtonTapReduced,
  ctaHidden,
  ctaTransition,
  ctaTransitionReduced,
  ctaVisible,
  storyButtonClassName,
  storyButtonStyle,
} from "./motion/storyTextMotion";

interface StoryContinueProps {
  visible: boolean;
  onClick: () => void;
  label?: string;
}

// The "keep going" affordance below a settled block of text. Always
// mounted — visibility toggles purely via opacity — so its appearance can
// never shift or reposition the text above it. A real pill button: rounded,
// translucent lavender fill, visible border, subtle shadow/glow — not an
// underlined text link.
export function StoryContinue({ visible, onClick, label = "Continue →" }: StoryContinueProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={storyButtonClassName}
      style={{
        ...storyButtonStyle,
        pointerEvents: visible ? "auto" : "none",
      }}
      initial={ctaHidden}
      animate={visible ? ctaVisible : ctaHidden}
      transition={shouldReduceMotion ? ctaTransitionReduced : ctaTransition}
      whileHover={shouldReduceMotion ? actionButtonHoverReduced : actionButtonHover}
      whileTap={shouldReduceMotion ? actionButtonTapReduced : actionButtonTap}
    >
      {label}
    </motion.button>
  );
}
