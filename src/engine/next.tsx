"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  initScroll,
  destroyScroll,
  getLenis,
  initReveals,
  destroyReveals,
  initInteractions,
  destroyInteractions,
  initGL,
  destroyGL,
  initLoader,
  type EngineOptions,
} from "./index";

gsap.registerPlugin(ScrollTrigger);

export function EngineProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: EngineOptions;
}) {
  const pathname = usePathname();
  const booted = useRef(false);

  useEffect(() => {
    initScroll();
    if (options?.gl !== false) initGL();
    return () => {
      destroyGL();
      destroyScroll();
    };
  }, [options?.gl]);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true });

    initReveals();
    initInteractions();

    if (!booted.current) {
      booted.current = true;
      void initLoader(options);
    } else {
      const curtain = document.querySelector<HTMLElement>("[data-transition]");
      if (curtain) {
        gsap.fromTo(
          curtain,
          { scaleY: 1, transformOrigin: "top center" },
          { scaleY: 0, duration: 0.55, ease: "expo.inOut" }
        );
      }
    }

    ScrollTrigger.refresh();

    return () => {
      destroyReveals();
      destroyInteractions();
    };
  }, [pathname, options]);

  return <>{children}</>;
}

