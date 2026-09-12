import { useCallback, useEffect, useRef } from "react";
import musicSrc from "../assets/audio/The_Midnight.mp3";

// Gentle fade-in when playback first starts, so the very first sound is an
// ease-in rather than an instant blast at full volume.
const FADE_IN_MS = 1000;
// Default smoothing for scene-driven volume targets (choice screen duck,
// branch endings). "Gradually", never an abrupt jump.
const DEFAULT_RAMP_MS = 1500;

// One persistent HTMLAudioElement for the entire app session, created
// exactly once (lazy ref init — survives every scene change, since this
// hook is only ever called once, at the App level, and App itself never
// remounts when `scene` changes). Volume is automated via smooth
// requestAnimationFrame ramps; playback speed/pitch are never touched.
// Fails silently at every step — a browser blocking autoplay, a failed
// load, or no Audio support at all must never break the rest of the site.
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rampFrameRef = useRef<number | null>(null);

  if (audioRef.current === null && typeof Audio !== "undefined") {
    try {
      const audio = new Audio(musicSrc);
      audio.loop = true;
      audio.volume = 0;
      audio.preload = "auto";
      audioRef.current = audio;
    } catch {
      audioRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (rampFrameRef.current !== null) cancelAnimationFrame(rampFrameRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const rampVolumeTo = useCallback((target: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (rampFrameRef.current !== null) {
      cancelAnimationFrame(rampFrameRef.current);
      rampFrameRef.current = null;
    }

    const clampedTarget = Math.min(1, Math.max(0, target));

    if (durationMs <= 0) {
      audio.volume = clampedTarget;
      return;
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Cosine ease — smooth acceleration/deceleration rather than a
      // mechanical linear fade.
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);
      audio.volume = startVolume + (clampedTarget - startVolume) * eased;

      if (progress < 1) {
        rampFrameRef.current = requestAnimationFrame(step);
      } else {
        rampFrameRef.current = null;
      }
    };

    rampFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Called only from a real user gesture (Opening's existing click
  // handler). Never restarts an already-playing track — safe to call more
  // than once.
  const start = useCallback(
    (targetVolume: number) => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;

      audio.volume = 0;
      let playResult: ReturnType<HTMLAudioElement["play"]> | undefined;
      try {
        playResult = audio.play();
      } catch {
        return;
      }

      if (playResult && typeof playResult.then === "function") {
        playResult.then(() => rampVolumeTo(targetVolume, FADE_IN_MS)).catch(() => {});
      } else {
        rampVolumeTo(targetVolume, FADE_IN_MS);
      }
    },
    [rampVolumeTo],
  );

  // Scene-driven volume target. A no-op until playback has actually
  // started (audio.paused), so it's always safe to call — including before
  // OPEN THIS has ever been clicked.
  const setVolumeTarget = useCallback(
    (target: number, durationMs: number = DEFAULT_RAMP_MS) => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      rampVolumeTo(target, durationMs);
    },
    [rampVolumeTo],
  );

  return { start, setVolumeTarget };
}
