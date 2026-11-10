import gsap from "gsap";
import { env } from "./env";

const KEY = "fadli_portfolio_loaded_v2";

export interface LoaderOptions {
  minDuration?: number;
  onHeroEnter?: (tl: gsap.core.Timeline) => void;
}

export function initLoader(opts: LoaderOptions = {}): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  const el = document.querySelector<HTMLElement>("#loader, [data-loader]");
  const countEl = document.querySelector<HTMLElement>("[data-loader-count]");
  const barEl = document.querySelector<HTMLElement>("[data-loader-bar]");

  const seen = (() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  })();

  if (!el || seen || env.reducedMotion) {
    if (el) {
      el.style.display = "none";
      el.remove();
    }
    const tl = gsap.timeline();
    opts.onHeroEnter?.(tl);
    return Promise.resolve();
  }

  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // ignore
  }

  const minDur = opts.minDuration ?? 0.45;
  const counter = { v: 0 };

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        el.remove();
        resolve();
      },
    });

    tl.to(counter, {
      v: 100,
      duration: minDur,
      ease: "power2.inOut",
      onUpdate: () => {
        const n = Math.round(counter.v);
        if (countEl) countEl.textContent = String(n).padStart(3, "0");
        if (barEl) barEl.style.transform = `scaleX(${counter.v / 100})`;
      },
    });

    tl.to(
      el,
      {
        yPercent: -100,
        opacity: 0,
        duration: 0.45,
        ease: "expo.inOut",
      },
      ">-0.05"
    );

    opts.onHeroEnter?.(tl);
  });
}
