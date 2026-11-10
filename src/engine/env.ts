const mq = (q: string) =>
  typeof window !== "undefined" ? window.matchMedia(q) : ({ matches: false } as MediaQueryList);

export const env = {
  get reducedMotion() {
    return mq("(prefers-reduced-motion: reduce)").matches;
  },
  get coarsePointer() {
    return mq("(pointer: coarse)").matches;
  },
  get finePointer() {
    return mq("(hover: hover) and (pointer: fine)").matches;
  },
  get mobile() {
    return mq("(max-width: 767px)").matches;
  },
  get dpr() {
    return typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  },
};

