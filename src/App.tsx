import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SceneBackdrop } from "./components/background/SceneBackdrop";
import type { PhotoRect } from "./components/background/SceneBackdrop";
import { StoryScene } from "./components/StoryScene";
import { Opening } from "./components/sections/Opening";
import { NarrativeScene } from "./components/sections/NarrativeScene";
import { NoExpectations } from "./components/sections/NoExpectations";
import { FinalMessage } from "./components/sections/FinalMessage";
import { sceneImages } from "./content/sceneImages";
import { useBackgroundMusic } from "./audio/useBackgroundMusic";
import type { Branch, Scene } from "./types/content";

// Cinematic volume per scene — the same persistent track just ramps
// smoothly toward whichever of these applies to the current scene.
const MAIN_STORY_VOLUME = 0.55;
const CHOICE_SCREEN_VOLUME = 0.35;
const COFFEE_ENDING_VOLUME = 0.5;
const APPRECIATION_ENDING_VOLUME = 0.35;

function targetVolumeForScene(scene: Scene): number {
  if (scene === "expectations") return CHOICE_SCREEN_VOLUME;
  if (scene === "coffee-final") return COFFEE_ENDING_VOLUME;
  if (scene === "appreciation-final") return APPRECIATION_ENDING_VOLUME;
  return MAIN_STORY_VOLUME;
}

function App() {
  const [scene, setScene] = useState<Scene>("opening");
  const [branch, setBranch] = useState<Branch>(null);
  // The ACTUAL measured rendered rectangle of the current scene's photo
  // (see SceneBackdrop's PhotoRectMeasurer) — null for photo-less scenes.
  // StoryScene bounds all story text/panels/buttons to this exact rect so
  // nothing can spill into the black letterbox/pillarbox margin.
  const [photoRect, setPhotoRect] = useState<PhotoRect | null>(null);
  const handleRectChange = useCallback((rect: PhotoRect | null) => setPhotoRect(rect), []);
  // Once the reader has read through the expectations scene once (i.e. they
  // picked a branch), returning to it should show the two options
  // immediately rather than replaying the typewriter from scratch.
  const [returningToChoice, setReturningToChoice] = useState(false);

  // One persistent audio controller for the whole session (see
  // useBackgroundMusic) — App itself never remounts on scene changes, so
  // this survives the entire story untouched. Playback only ever starts
  // from Opening's own click handler (a real user gesture); this effect
  // just smoothly retargets the volume whenever the current scene changes,
  // and is a safe no-op before playback has started.
  const { start: startMusic, setVolumeTarget } = useBackgroundMusic();

  useEffect(() => {
    setVolumeTarget(targetVolumeForScene(scene));
  }, [scene, setVolumeTarget]);

  // Preload every photo (desktop + mobile) once, up front, so a scene's
  // crossfade never has to wait on a network fetch mid-transition.
  useEffect(() => {
    Object.values(sceneImages).forEach((pair) => {
      if (!pair) return;
      const desktopImg = new Image();
      desktopImg.src = pair.desktop;
      const mobileImg = new Image();
      mobileImg.src = pair.mobile;
    });
  }, []);

  const chooseBranch = (nextBranch: Exclude<Branch, null>) => {
  setBranch(nextBranch);
  setScene(nextBranch === "coffee" ? "coffee-final" : "appreciation-final");

  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choice: nextBranch }),
  }).catch(() => {
    // Intentionally ignored
  });
};

  const renderScene = () => {
    switch (scene) {
      case "opening":
        return <Opening onContinue={() => setScene("ordinary-class")} onOpen={() => startMusic(MAIN_STORY_VOLUME)} />;
      case "ordinary-class":
        return <NarrativeScene scene={scene} onContinue={() => setScene("noticed-you")} />;
      case "noticed-you":
        return <NarrativeScene scene={scene} onContinue={() => setScene("beautiful")} />;
      case "beautiful":
        return <NarrativeScene scene={scene} onContinue={() => setScene("growing")} />;
      case "growing":
        return <NarrativeScene scene={scene} onContinue={() => setScene("little-reasons")} />;
      case "little-reasons":
        return <NarrativeScene scene={scene} onContinue={() => setScene("interactions")} />;
      case "interactions":
        return <NarrativeScene scene={scene} onContinue={() => setScene("little-things")} />;
      case "little-things":
        return <NarrativeScene scene={scene} onContinue={() => setScene("kind-of")} />;
      case "kind-of":
        return <NarrativeScene scene={scene} onContinue={() => setScene("honest-part")} />;
      case "honest-part":
        return <NarrativeScene scene={scene} onContinue={() => setScene("expectations")} />;
      case "expectations":
        return <NoExpectations branch={branch} onChoose={chooseBranch} instant={returningToChoice} />;
      case "coffee-final":
      case "appreciation-final":
        return (
          <FinalMessage
            branch={branch}
            onReturnToChoice={() => {
              setBranch(null);
              setReturningToChoice(true);
              setScene("expectations");
            }}
          />
        );
    }
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* The photo crossfade starts the instant `scene` changes (i.e. the
          instant Continue is clicked) — simultaneous with StoryScene's own
          text exit below, never deferred to after it. Pure black shows
          behind/around every photo (body background), never the old
          NightSky gradient. */}
      <SceneBackdrop scene={scene} onRectChange={handleRectChange} />
      <main className="relative h-full">
        <AnimatePresence mode="wait" initial={false}>
          <StoryScene key={scene} scene={scene} photoRect={photoRect}>
            {renderScene()}
          </StoryScene>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
