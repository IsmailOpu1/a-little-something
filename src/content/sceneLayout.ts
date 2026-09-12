import type { Scene } from "../types/content";

// Story text is always centered — no per-scene/per-device positional
// variation. (An earlier pass varied this per scene based on each photo's
// composition; that has been removed by request. Every scene now uses the
// same centered vertical reading position regardless of which photograph
// is behind it.)
export function sceneAnchorClassName(_scene: Scene): string {
  return "my-auto";
}
