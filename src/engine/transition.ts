import gsap from "gsap";
import { env } from "./env";

let cleanups: Array<() => void> = [];

export function initTransitions() {
  destroyTransitions();
  if (typeof document === "undefined") return;
  const curtain = document.querySelector<HTMLElement>("[data-transition]");
  if (!curtain || env.reducedMotion) return;

  gsap.fromTo(
    curtain,
    { scaleY: 1, transformOrigin: "top center" },
    { scaleY: 0, duration: 0.55, ease: "expo.inOut", delay: 0.04 }
  );
}

export function destroyTransitions() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}

