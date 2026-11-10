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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
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
            willChange: "transform, filter, opacity",
            transitionProperty: "transform, filter, opacity",
            transitionDuration: "720ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${index * delay}ms`,
            opacity: inView ? 1 : 0,
            filter: inView ? "blur(0px)" : "blur(12px)",
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

