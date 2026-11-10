"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  animateOn?: "view" | "hover" | "both";
}

export function DecryptedText({
  text,
  speed = 32,
  maxIterations = 12,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>",
  className = "",
  animateOn = "both",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimatedView, setHasAnimatedView] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const runScramble = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    let iteration = 0;
    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < (iteration / maxIterations) * text.length) {
              return text[idx];
            }
            return characters[Math.floor(Math.random() * characters.length)] ?? char;
          })
          .join("")
      );
      iteration += 1;
      if (iteration > maxIterations) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  }, [characters, maxIterations, speed, text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "both") return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimatedView) {
          setHasAnimatedView(true);
          runScramble();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOn, hasAnimatedView, runScramble]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => {
        if (animateOn === "hover" || animateOn === "both") {
          runScramble();
        }
      }}
      className={`inline-block ${className}`}
    >
      {displayText}
    </span>
  );
}

