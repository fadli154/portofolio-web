"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

export interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  staggerDuration?: number;
  effect?: "slide" | "flip" | "blur" | "scale" | "drop";
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  loop?: boolean;
  auto?: boolean;
  onNext?: (index: number) => void;
}

export function RotatingText({
  texts,
  rotationInterval = 2800,
  staggerFrom = "first",
  staggerDuration = 0.02,
  effect = "slide",
  mainClassName = "",
  splitLevelClassName = "",
  elementLevelClassName = "",
  loop = true,
  auto = true,
  onNext,
}: RotatingTextProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentText = texts[currentIdx] ?? texts[0] ?? "";

  const characters = useMemo(() => {
    return Array.from(currentText);
  }, [currentText]);

  const getStaggerDelay = useCallback(
    (index: number, total: number) => {
      let relativeIndex = index;
      if (staggerFrom === "last") {
        relativeIndex = total - 1 - index;
      } else if (staggerFrom === "center") {
        const center = (total - 1) / 2;
        relativeIndex = Math.abs(index - center);
      } else if (staggerFrom === "random") {
        relativeIndex = (index * 7) % total;
      } else if (typeof staggerFrom === "number") {
        relativeIndex = Math.abs(index - staggerFrom);
      }
      return relativeIndex * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const advance = useCallback(() => {
    setIsAnimating(true);
    setCurrentIdx((prev) => {
      const next = (prev + 1) % texts.length;
      if (onNext) onNext(next);
      return next;
    });
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [texts.length, onNext]);

  useEffect(() => {
    if (!auto || isPaused || texts.length <= 1) return;

    timeoutRef.current = setInterval(() => {
      advance();
    }, rotationInterval);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [advance, auto, isPaused, rotationInterval, texts.length]);

  return (
    <span
      className={`inline-flex items-center overflow-hidden align-middle select-none transition-all duration-300 ${mainClassName}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-live="polite"
      aria-label={currentText}
    >
      <span className={`inline-flex flex-wrap items-center ${splitLevelClassName}`}>
        {characters.map((char, charIdx) => {
          const delay = getStaggerDelay(charIdx, characters.length);
          const isSpace = char === " ";

          if (isSpace) {
            return (
              <span key={`space-${charIdx}`} className="inline-block w-[0.28em]">
                &nbsp;
              </span>
            );
          }

          let animClasses = "";
          if (effect === "flip") {
            animClasses = "transition-all duration-500 [transform-style:preserve-3d]";
          } else if (effect === "blur") {
            animClasses = "transition-all duration-400";
          } else {
            animClasses = "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]";
          }

          return (
            <span
              key={`${currentIdx}-${charIdx}`}
              style={{
                transitionDelay: `${delay}s`,
                animationDelay: `${delay}s`,
              }}
              className={`inline-block origin-bottom ${animClasses} ${
                isAnimating ? "animate-rotate-in" : ""
              } ${elementLevelClassName}`}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default RotatingText;

