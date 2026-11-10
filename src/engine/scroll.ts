import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { env } from "./env";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollState {
  scroll: number;
  limit: number;
  velocity: number;
  progress: number;
  direction: 1 | -1;
}

export const scrollState: ScrollState = {
  scroll: 0,
  limit: 1,
  velocity: 0,
  progress: 0,
  direction: 1,
};

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  if (env.reducedMotion) {
    const onNative = () => {
      const s = window.scrollY;
      const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollState.direction = s >= scrollState.scroll ? 1 : -1;
      scrollState.velocity = 0;
      scrollState.scroll = s;
      scrollState.limit = limit;
      scrollState.progress = s / limit;
    };
    window.addEventListener("scroll", onNative, { passive: true });
    onNative();
    return null;
  }

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
  });

  lenis.on("scroll", (e: Lenis) => {
    scrollState.scroll = e.scroll;
    scrollState.limit = Math.max(1, e.limit);
    scrollState.velocity = e.velocity;
    scrollState.progress = e.progress;
    scrollState.direction = e.direction === -1 ? -1 : 1;
    ScrollTrigger.update();
  });

  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollTo(
  target: number | string | HTMLElement,
  opts?: { offset?: number; duration?: number; immediate?: boolean }
) {
  if (lenis) {
    lenis.scrollTo(target, opts);
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: opts?.immediate ? "auto" : "smooth" });
  } else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
  }
}

export function destroyScroll() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  lenis?.destroy();
  lenis = null;
  tickerFn = null;
}

