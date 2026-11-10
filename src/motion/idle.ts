import gsap from "gsap";
import { env } from "@/engine";

export function bootIdleMotion(): () => void {
  if (typeof document === "undefined" || env.reducedMotion) {
    return () => {};
  }

  let time = 0;
  const tick = () => {
    if (document.hidden) return;
    time += 0.016;
    const pulseEl = document.querySelector<HTMLElement>("[data-telemetry-clock]");
    if (pulseEl && Math.floor(time * 2) !== Math.floor((time - 0.016) * 2)) {
      const jitter = (17.8 + Math.sin(time * 1.7) * 0.9).toFixed(1);
      pulseEl.textContent = `${jitter} ms`;
    }
  };

  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
  };
}

