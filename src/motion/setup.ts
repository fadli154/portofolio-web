"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EngineProvider } from "@/engine/next";
import { splitElement } from "@/engine";
import { bootIdleMotion } from "./idle";

gsap.registerPlugin(ScrollTrigger);

function heroEnter(tl: gsap.core.Timeline) {
  const headline = document.querySelector<HTMLElement>("[data-hero-reveal]");
  const subs = document.querySelectorAll<HTMLElement>("[data-hero-sub]");
  const rules = document.querySelectorAll<HTMLElement>("[data-hero-rule]");

  if (headline) {
    const { lines } = splitElement(headline);
    if (lines.length === 1 && lines[0] === headline) {
      gsap.set(headline, { y: 16, opacity: 0 });
      tl.to(headline, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.25");
    } else {
      gsap.set(lines, { yPercent: 105 });
      tl.to(lines, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=0.25");
    }
  }
  if (rules.length) {
    gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
    tl.to(rules, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, "-=0.65");
  }
  if (subs.length) {
    gsap.set(subs, { y: 16, opacity: 0 });
    tl.to(subs, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.06 }, "-=0.55");
  }
}

export function MotionSetup({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stopIdle = bootIdleMotion();
    return () => stopIdle();
  }, []);

  return React.createElement(EngineProvider, {
    options: { onHeroEnter: heroEnter },
    children,
  });
}
