import { useState } from "react";
import { StoryContinue } from "../StoryContinue";
import { StoryLines } from "../StoryLines";
import { message } from "../../content/message.config";
import type { NarrativeSceneId } from "../../types/content";

export function NarrativeScene({ scene, onContinue }: { scene: NarrativeSceneId; onContinue: () => void }) {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 py-4">
      <StoryLines lines={message.scenes[scene].lines} onRevealComplete={() => setIsComplete(true)} />
      <StoryContinue visible={isComplete} onClick={onContinue} label="Continue →" />
    </div>
  );
}
