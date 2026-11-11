"use client";

import React, { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
}

export function BlurText({
  text,
  delay = 45,
  animateBy = "words",
  direction = "bottom",
  className = "",
  as: Tag = "span",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const checkVisibility = () => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      // If element is in viewport OR has already been scrolled past
      if (rect.top <= window.innerHeight + 100) {
        setInView(true);
        return true;
      }
      return false;
    };

    if (checkVisibility()) return;

    const onScrollOrResize = () => {
      if (checkVisibility()) {
        window.removeEventListener("scroll", onScrollOrResize);
        window.removeEventListener("resize", onScrollOrResize);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting || (entry && entry.boundingClientRect.top < window.innerHeight)) {
          setInView(true);
          observer.unobserve(node);
          window.removeEventListener("scroll", onScrollOrResize);
          window.removeEventListener("resize", onScrollOrResize);
        }
      },
      { threshold: 0.01, rootMargin: "120px 0px 120px 0px" }
    );
    observer.observe(node);

    // Hard fallback timeout: ensure title is never permanently hidden under any edge case
    const fallbackTimer = setTimeout(() => {
      setInView(true);
    }, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const yOffset = direction === "top" ? "-22px" : "22px";

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={`inline-block ${className}`}>
      {elements.map((segment, index) => (
        <span
          key={`${segment}-${index}`}
          style={{
            display: "inline-block",
            color: "inherit",
            willChange: "transform, filter, opacity",
            transitionProperty: "transform, filter, opacity",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${index * delay}ms`,
            opacity: inView ? 1 : 0,
            filter: inView ? "blur(0px)" : "blur(10px)",
            transform: inView ? "translate3d(0,0,0)" : `translate3d(0,${yOffset},0)`,
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

