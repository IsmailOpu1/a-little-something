import type { Scene } from "../types/content";

import openingDesktop from "../assets/photos/desktop/opening.jpg";
import openingMobile from "../assets/photos/mobile/opening.jpg";
import ordinaryClassDesktop from "../assets/photos/desktop/ordinary-class.jpg";
import ordinaryClassMobile from "../assets/photos/mobile/ordinary-class.jpg";
import noticedYouDesktop from "../assets/photos/desktop/noticed-you.jpg";
import noticedYouMobile from "../assets/photos/mobile/noticed-you.jpg";
import beautifulDesktop from "../assets/photos/desktop/beautiful.jpg";
import beautifulMobile from "../assets/photos/mobile/beautiful.jpg";
import growingDesktop from "../assets/photos/desktop/growing.jpg";
import growingMobile from "../assets/photos/mobile/growing.jpg";
import littleReasonsDesktop from "../assets/photos/desktop/little-reasons.jpg";
import littleReasonsMobile from "../assets/photos/mobile/little-reasons.jpg";
import interactionsDesktop from "../assets/photos/desktop/interactions.jpg";
import interactionsMobile from "../assets/photos/mobile/interactions.jpg";
import littleThingsDesktop from "../assets/photos/desktop/little-things.jpg";
import littleThingsMobile from "../assets/photos/mobile/little-things.jpg";
import kindOfDesktop from "../assets/photos/desktop/kind-of.jpg";
import kindOfMobile from "../assets/photos/mobile/kind-of.jpg";
import honestPartDesktop from "../assets/photos/desktop/honest-part.jpg";
import honestPartMobile from "../assets/photos/mobile/honest-part.jpg";
import coffeeFinalDesktop from "../assets/photos/desktop/coffee-final.jpg";
import coffeeFinalMobile from "../assets/photos/mobile/coffee-final.jpg";
import appreciationFinalDesktop from "../assets/photos/desktop/appreciation-final.jpg";
import appreciationFinalMobile from "../assets/photos/mobile/appreciation-final.jpg";

export interface SceneImagePair {
  desktop: string;
  mobile: string;
}

// Not every Scene has a photo — "expectations" (the two-choice screen)
// intentionally has none, confirmed with the person providing the assets.
export const sceneImages: Partial<Record<Scene, SceneImagePair>> = {
  opening: { desktop: openingDesktop, mobile: openingMobile },
  "ordinary-class": { desktop: ordinaryClassDesktop, mobile: ordinaryClassMobile },
  "noticed-you": { desktop: noticedYouDesktop, mobile: noticedYouMobile },
  beautiful: { desktop: beautifulDesktop, mobile: beautifulMobile },
  growing: { desktop: growingDesktop, mobile: growingMobile },
  "little-reasons": { desktop: littleReasonsDesktop, mobile: littleReasonsMobile },
  interactions: { desktop: interactionsDesktop, mobile: interactionsMobile },
  "little-things": { desktop: littleThingsDesktop, mobile: littleThingsMobile },
  "kind-of": { desktop: kindOfDesktop, mobile: kindOfMobile },
  "honest-part": { desktop: honestPartDesktop, mobile: honestPartMobile },
  "coffee-final": { desktop: coffeeFinalDesktop, mobile: coffeeFinalMobile },
  "appreciation-final": { desktop: appreciationFinalDesktop, mobile: appreciationFinalMobile },
};
