"use client";

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("fadli_sound_enabled", enabled ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }
}

export function initSoundPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = window.localStorage.getItem("fadli_sound_enabled");
    soundEnabled = saved === "1";
  } catch {
    soundEnabled = false;
  }
  return soundEnabled;
}

/**
 * Synthesizes a subtle, crisp mechanical switch click using Web Audio API.
 * Strictly opt-in (off by default) to respect user audio preferences.
 */
export function playMechanicalClick(frequency = 640): void {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.028);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.028);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Ignore audio context restrictions
  }
}

