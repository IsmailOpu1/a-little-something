// Extremely simple, CSS-only background.
// A radial gradient for depth + a static star field via box-shadow trick.
// No canvas, no particle library. Add complexity later only if genuinely needed.

export function NightSky() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, var(--color-deep-navy) 0%, var(--color-midnight) 70%)",
      }}
      aria-hidden="true"
    />
  );
}
