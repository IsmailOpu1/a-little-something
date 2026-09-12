// Shape of the personal content that drives every section.
// Actual wording lives in src/content/message.config.ts, not here.

// A single line of narrative text. `emphasis` marks lines that should be
// rendered as a standalone, visually heavier beat (e.g. "I just do.") —
// used sparingly, not on every line.
export interface StoryLine {
  text: string;
  emphasis?: boolean;
}

// The choice made in NoExpectations, read by FinalMessage. Lives in App
// state (not persisted) — null means no choice has been made yet.
export type Branch = "coffee" | "appreciation" | null;

export type NarrativeSceneId =
  | "ordinary-class"
  | "noticed-you"
  | "beautiful"
  | "growing"
  | "little-reasons"
  | "interactions"
  | "little-things"
  | "kind-of"
  | "honest-part";

export type Scene =
  | "opening"
  | NarrativeSceneId
  | "expectations"
  | "coffee-final"
  | "appreciation-final";

export interface MessageContent {
  herName: string;
  yourName: string;

  opening: {
    initialLines: StoryLine[];
    ctaText: string;
    revealLine: string;
  };

  scenes: Record<NarrativeSceneId, { lines: StoryLine[] }>;

  noExpectations: {
    lines: StoryLine[];
    choices: {
      coffeeLabel: string;
      appreciationLabel: string;
    };
  };

  finalMessage: {
    coffee: {
      lines: StoryLine[];
    };
    appreciation: {
      lines: StoryLine[];
      secondaryPrompt: string;
      secondaryReveal: StoryLine[];
      backButtonLabel: string;
    };
  };
}
