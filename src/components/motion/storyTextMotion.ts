// Single source of truth for every non-text-beat motion in the site.
// Per-line text apparition lives in StoryTextBeat; everything else that
// needs to fade in/out — full scenes, the Opening gate, Continue affordances,
// choice buttons — pulls its numbers from here so nothing drifts out of
// sync with Opening, the reference implementation.

// Scene-level transition. Used by StoryScene for every top-level page
// enter/exit, and by Opening's own closed→opened swap. Deliberately
// opacity(+blur-on-exit) only — no y or scale — so it never compounds with
// the per-line text motion happening inside it.
export const storySequenceInitial = { opacity: 0 };
export const storySequenceAnimate = { opacity: 1 };
export const storySequenceExit = { opacity: 0, filter: "blur(6px)" };
export const storySequenceExitReduced = { opacity: 0 };
export const storySequenceTransition = { duration: 0.8, ease: "easeInOut" as const };
export const storySequenceTransitionReduced = { duration: 0.15, ease: "easeInOut" as const };

// How long to wait after the last text beat settles before revealing the
// next affordance (Continue button / choices). Shared so every scene pauses
// for the same beat before inviting the reader onward.
export const postRevealPause = 900;

// Per-line stagger for StoryTextBeat. Each line waits textBeatStagger
// seconds after the previous one starts, so on a comfortable reading pace
// each line has mostly settled before the next begins rather than several
// overlapping mid-fade at once.
// StoryTextBeat is now only used by the Opening's closed-gate teaser lines
// ("There's something I've been meaning to tell you..." + OPEN THIS →),
// which are intentionally left untouched. Every other narrative beat
// (Opening's post-click reveal line, and every StoryLines consumer) uses
// the typewriter constants below instead.
export const textBeatDuration = 0.9;
export const textBeatStagger = 0.45;
export const textBeatDurationReduced = 0.15;
export const textBeatStaggerReduced = 0;

// Typewriter reveal — used for the Opening's reveal line and every
// StoryLines-driven scene. Deliberately no cap on total duration: unlike
// the capped text-beat stagger above, the point here is to let typing
// take however long the sentence needs, giving the reader a natural pace
// rather than a fixed 2-3s ceiling.
export const typewriterCharDelay = 50; // ms per character while typing — slow enough to read as it types
export const typewriterCharDelayReduced = 30; // reduced motion: still noticeably slower, but a bit quicker than normal
export const typewriterLineGap = 350; // ms pause after one line finishes before the next starts typing

// CTA apparition — the exact fade Opening's "OPEN THIS →" uses. Reused by
// the Continue affordance and the NoExpectations choice buttons. Always
// mounted wherever it's used; visibility is driven by the `animate` prop,
// never by conditional mounting, so its appearance can never shift the
// already-settled text above it.
export const ctaHidden = { opacity: 0 };
export const ctaVisible = { opacity: 0.9 };
export const ctaTransition = { duration: 1.4, ease: "easeOut" as const };
export const ctaTransitionReduced = { duration: 0.2, ease: "easeOut" as const };

// The translucent lavender caption panel every text beat now sits in, now
// that scenes have real photos behind them. Content-sized (inline-block,
// capped by max-width so a long sentence still wraps sensibly), soft
// rounded corners, subtle border/shadow, no glassmorphism blur. The panel
// itself is static — only the text inside it animates — matching "the
// animation happens primarily on the text layer".
//
// The fill is a blend of midnight + lavender-mist (not lavender-mist alone)
// at a higher alpha than before: lavender-mist alone was too light/too
// transparent to reliably darken bright photo backgrounds, which is why
// white text was disappearing against them. Blending in midnight first
// gives a real darkening base while the mix stays visibly purple, then that
// blend is applied at ~74% opacity (bumped up from 64% — still translucent,
// but a noticeably firmer backing against bright/busy photos) — still
// translucent enough that the photo reads through clearly.
export const storyPanelClassName =
  "inline-block max-w-[88vw] md:max-w-xl rounded-2xl border px-4 py-2 md:px-5 md:py-2.5";
export const storyPanelStyle = {
  backgroundColor:
    "color-mix(in srgb, color-mix(in srgb, var(--color-midnight) 55%, var(--color-lavender-mist) 45%) 74%, transparent)",
  borderColor: "color-mix(in srgb, var(--color-lavender-mist) 60%, transparent)",
  boxShadow: "0 8px 24px color-mix(in srgb, var(--color-midnight) 60%, transparent)",
};
// Two layers: a tight, close shadow that does the actual work of
// separating each letterform from the photo behind it, plus a slightly
// wider soft one for extra depth — strengthened from a single 4px shadow,
// but still a soft shadow, never a hard/thick outline.
export const storyPanelTextShadow =
  "0 1px 2px color-mix(in srgb, var(--color-midnight) 92%, transparent), 0 2px 6px color-mix(in srgb, var(--color-midnight) 75%, transparent)";

// The real pill-button treatment for "Continue" and Opening's "OPEN THIS →"
// (both share this now, by request — full visual consistency). Same
// translucent lavender/midnight blend as the text panels above so the
// button reads as part of the same design language, just solid enough and
// bordered enough to look immediately clickable rather than like a caption.
export const storyButtonClassName =
  "story-action-btn story-btn-lavender min-h-11 px-6 py-2.5 rounded-full font-sans-ui text-sm md:text-base cursor-pointer border";
export const storyButtonStyle = {
  color: "var(--color-warm-white)",
  backgroundColor:
    "color-mix(in srgb, color-mix(in srgb, var(--color-midnight) 45%, var(--color-lavender-mist) 55%) 78%, transparent)",
  borderColor: "color-mix(in srgb, var(--color-lavender-mist) 65%, transparent)",
  boxShadow: "0 6px 18px color-mix(in srgb, var(--color-midnight) 50%, transparent), 0 0 16px color-mix(in srgb, var(--color-lavender-mist) 25%, transparent)",
  textShadow: storyPanelTextShadow,
};

// Hover/press motion — shared by every real action button on the site.
// Subtle lift + scale on hover, settles back down on press. The
// accompanying glow/brightness shift lives in index.css (.story-action-btn
// and friends) since Motion's string-interpolation doesn't reliably
// animate multi-stop box-shadow values.
export const actionButtonHover = { y: -2.5, scale: 1.02, transition: { duration: 0.2, ease: "easeOut" as const } };
export const actionButtonTap = { y: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" as const } };
export const actionButtonHoverReduced = { scale: 1, transition: { duration: 0.15, ease: "easeOut" as const } };
export const actionButtonTapReduced = { scale: 1, transition: { duration: 0.1, ease: "easeOut" as const } };

// The two main-choice buttons. Distinct but coordinated: both are built
// from the same underlying palette (soft-pink appears in each), one
// leaning warm/rose (coffee), one leaning cool/lavender (appreciation) —
// related, not identical. Dark (midnight) text for contrast against these
// lighter pastel fills, matching the existing precedent elsewhere in this
// file of switching to midnight text on light accent-colored fills.
export const storyActionButtonBaseClassName =
  "story-action-btn min-h-12 px-7 py-3 md:px-8 md:py-3.5 rounded-full font-sans-ui text-base md:text-lg font-medium cursor-pointer border text-center";

export const coffeeButtonStyle = {
  color: "var(--color-midnight)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--color-soft-pink) 65%, var(--color-warm-white) 35%) 0%, var(--color-muted-rose) 100%)",
  borderColor: "color-mix(in srgb, var(--color-muted-rose) 70%, transparent)",
  boxShadow: "0 6px 20px color-mix(in srgb, var(--color-muted-rose) 35%, transparent)",
};

export const appreciationButtonStyle = {
  color: "var(--color-midnight)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--color-lavender-mist) 70%, var(--color-soft-pink) 30%) 0%, var(--color-lavender-mist) 100%)",
  borderColor: "color-mix(in srgb, var(--color-lavender-mist) 70%, transparent)",
  boxShadow: "0 6px 20px color-mix(in srgb, var(--color-lavender-mist) 35%, transparent)",
};
