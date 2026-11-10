import { initScroll, destroyScroll, scrollState, scrollTo, getLenis } from "./scroll";
import { initReveals, destroyReveals, splitElement } from "./reveal";
import { initLoader, type LoaderOptions } from "./loader";
import { initInteractions, destroyInteractions } from "./interactions";
import { initTransitions, destroyTransitions } from "./transition";
import { initGL, destroyGL } from "./gl";
import { env } from "./env";

export interface EngineOptions extends LoaderOptions {
  gl?: boolean;
}

export async function bootEngine(opts: EngineOptions = {}) {
  initScroll();
  initTransitions();
  if (opts.gl !== false) initGL();
  initReveals();
  initInteractions();
  await initLoader(opts);
}

export function destroyEngine() {
  destroyInteractions();
  destroyReveals();
  destroyGL();
  destroyTransitions();
  destroyScroll();
}

export {
  env,
  scrollState,
  scrollTo,
  getLenis,
  splitElement,
  initScroll,
  destroyScroll,
  initReveals,
  destroyReveals,
  initInteractions,
  destroyInteractions,
  initGL,
  destroyGL,
  initLoader,
};
