import { useMemo } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  leftPercent: number;
  size: number;
  duration: number;
  delay: number;
  driftPx: number;
  opacity: number;
}

// Horizontal placement is weighted toward the edges — the center stays
// calmer so choice text/buttons remain visually dominant there.
function randomLeftPercent(): number {
  const edgeBiased = Math.random() < 0.6;
  if (edgeBiased) {
    const onLeft = Math.random() < 0.5;
    const edgeSpread = Math.random() * 22; // outer 0–22% band
    return onLeft ? edgeSpread : 100 - edgeSpread;
  }
  return 30 + Math.random() * 40; // calmer 30–70% center band
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      leftPercent: randomLeftPercent(),
      size: 2 + Math.random() * 4, // 2–6px — small flakes
      duration: 14 + Math.random() * 16, // 14–30s — slow drift
      delay: Math.random() * -30, // negative: already mid-fall on mount
      driftPx: (Math.random() - 0.5) * 60, // -30..30px horizontal sway
      opacity: 0.35 + Math.random() * 0.45, // 0.35–0.8 — subtle variance
    });
  }
  return particles;
}

// Roughly 20–40 particles depending on viewport size, per the brief.
function pickParticleCount(): number {
  if (typeof window === "undefined") return 28;
  const width = window.innerWidth;
  if (width <= 420) return 22;
  if (width <= 768) return 28;
  return 36;
}

// Purely decorative, sparse snowfall — scoped to the expectations/choice
// scene only (see NoExpectations.tsx, the only place this is rendered).
// Particle values are randomized once per mount via useMemo with an empty
// dependency array, so re-renders of the parent (button hover, isComplete
// toggling, etc.) never regenerate or restart them. Each particle's motion
// is a single CSS keyframe animation running on the compositor — no
// per-frame React/JS involvement at all after mount, and no React state
// updates ever happen inside this component.
export function Snowfall() {
  const shouldReduceMotion = useReducedMotion();
  const particles = useMemo(() => generateParticles(pickParticleCount()), []);

  // A continuously drifting effect is exactly what prefers-reduced-motion
  // exists to suppress — simplest correct behavior is to render nothing.
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="snowfall-particle"
          style={
            {
              left: `${particle.leftPercent}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              "--snow-drift": `${particle.driftPx}px`,
              "--snow-opacity": particle.opacity,
            } as CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}
