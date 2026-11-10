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
  overflowHidden?: boolean;
  onNext?: (index: number) => void;
}

export function RotatingText({
  texts,
  rotationInterval = 3200,
  staggerFrom = "first",
  staggerDuration = 0.015,
  effect = "slide",
  mainClassName = "",
  splitLevelClassName = "",
  elementLevelClassName = "",
  loop = true,
  auto = true,
  overflowHidden = false,
  onNext,
}: RotatingTextProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentText = texts[currentIdx] ?? texts[0] ?? "";

  // Split text into words and preserve word integrity so long strings don't break mid-word
  const words = useMemo(() => {
    const rawWords = currentText.split(" ");
    let charOffsetCounter = 0;
    return rawWords.map((word, wordIdx) => {
      const chars = Array.from(word);
      const startOffset = charOffsetCounter;
      charOffsetCounter += chars.length + (wordIdx < rawWords.length - 1 ? 1 : 0);
      return {
        word,
        characters: chars,
        startOffset,
        needsSpace: wordIdx < rawWords.length - 1,
      };
    });
  }, [currentText]);

  const totalChars = useMemo(() => {
    return words.reduce(
      (sum, w) => sum + w.characters.length + (w.needsSpace ? 1 : 0),
      0
    );
  }, [words]);

  // Adapt stagger dynamically so longer phrases don't take an eternity or get cut off
  const effectiveStagger = useMemo(() => {
    if (totalChars <= 20) return staggerDuration;
    // Cap total entrance stagger sequence to ~1.0s maximum regardless of length
    return Math.min(staggerDuration, 1.0 / Math.max(1, totalChars));
  }, [totalChars, staggerDuration]);

  const getStaggerDelay = useCallback(
    (index: number, total: number) => {
      let relativeIndex = index;
      if (staggerFrom === "last") {
        relativeIndex = total - 1 - index;
      } else if (staggerFrom === "center") {
        const center = (total - 1) / 2;
        relativeIndex = Math.abs(index - center);
      } else if (staggerFrom === "random") {
        relativeIndex = (index * 7) % Math.max(1, total);
      } else if (typeof staggerFrom === "number") {
        relativeIndex = Math.abs(index - staggerFrom);
      }
      return Number((relativeIndex * effectiveStagger).toFixed(3));
    },
    [staggerFrom, effectiveStagger]
  );

  const advance = useCallback(() => {
    setIsAnimating(true);
    setCurrentIdx((prev) => {
      const next = (prev + 1) % texts.length;
      if (onNext) onNext(next);
      return next;
    });

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    // Allow animation to fully complete across all characters before resetting isAnimating
    const totalDuration = Math.round((totalChars * effectiveStagger + 0.55) * 1000);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, totalDuration);
  }, [texts.length, onNext, totalChars, effectiveStagger]);

  useEffect(() => {
    if (!auto || isPaused || texts.length <= 1) return;

    timeoutRef.current = setInterval(() => {
      advance();
    }, rotationInterval);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [advance, auto, isPaused, rotationInterval, texts.length]);

  return (
    <span
      className={`inline-flex flex-wrap items-center align-middle select-none transition-all duration-300 ${
        overflowHidden ? "overflow-hidden" : ""
      } ${mainClassName}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-live="polite"
      aria-label={currentText}
    >
      <span className={`inline-flex flex-wrap items-center gap-y-1 ${splitLevelClassName}`}>
        {words.map((wordObj, wordIdx) => (
          <span
            key={`word-${currentIdx}-${wordIdx}`}
            className="inline-flex flex-nowrap items-center whitespace-nowrap"
          >
            {wordObj.characters.map((char, charIdx) => {
              const globalIdx = wordObj.startOffset + charIdx;
              const delay = getStaggerDelay(globalIdx, totalChars);

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
                  key={`char-${currentIdx}-${wordIdx}-${charIdx}`}
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
            {wordObj.needsSpace && (
              <span
                key={`space-${currentIdx}-${wordIdx}`}
                className="inline-block w-[0.32em] whitespace-pre"
              >
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

export default RotatingText;
