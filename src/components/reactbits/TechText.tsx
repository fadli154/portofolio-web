"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface TechTextProps {
  text: string;
  className?: string;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  clickKick?: boolean;
  intro?: "none" | "type" | "assemble" | "metrics";
  introDuration?: number;
  guides?: boolean;
  sweep?: boolean;
  speed?: number;
  accentColor?: string;
}

interface LetterPhysics {
  y: number;
  vy: number;
  x: number;
  vx: number;
  kicked: boolean;
}

export function TechText({
  text,
  className = "",
  specks = 12,
  selection = true,
  labels = true,
  draggable = true,
  bounce = 0.45,
  clickKick = true,
  intro = "assemble",
  introDuration = 1.6,
  guides = true,
  sweep = true,
  speed = 0.1,
  accentColor = "#c4e22e",
}: TechTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [sweepIdx, setSweepIdx] = useState<number>(-1);
  const [introFinished, setIntroFinished] = useState(intro === "none");
  const [activeDragIdx, setActiveDragIdx] = useState<number | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number } | null>(null);

  const letters = useMemo(() => Array.from(text), [text]);

  // Spring physics state per letter
  const [offsets, setOffsets] = useState<{ x: number; y: number }[]>(() =>
    letters.map(() => ({ x: 0, y: 0 }))
  );
  const physicsRef = useRef<LetterPhysics[]>(
    letters.map(() => ({ x: 0, vy: 0, y: 0, vx: 0, kicked: false }))
  );

  // Synchronize physics array when text length changes
  useEffect(() => {
    physicsRef.current = letters.map(() => ({ x: 0, vy: 0, y: 0, vx: 0, kicked: false }));
    setOffsets(letters.map(() => ({ x: 0, y: 0 })));
  }, [letters]);

  // Idle sweep animation
  useEffect(() => {
    if (!sweep) return;
    const interval = setInterval(() => {
      setSweepIdx((prev) => (prev + 1) % (letters.length + 8));
    }, 180 / speed);
    return () => clearInterval(interval);
  }, [sweep, letters.length, speed]);

  // Intro assemble animation
  useEffect(() => {
    if (intro === "none") return;
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, introDuration * 1000);
    return () => clearTimeout(timer);
  }, [intro, introDuration]);

  // Continuous animation frame loop for spring physics
  useEffect(() => {
    let animId: number;
    const k = 0.18; // Spring stiffness
    const d = 0.72 + (1 - bounce) * 0.18; // Damping

    const loop = () => {
      let needsUpdate = false;
      const nextOffsets = physicsRef.current.map((p, i) => {
        if (i === activeDragIdx) {
          return { x: p.x, y: p.y };
        }

        // Hooke's Law: F = -k * x - d * v
        const ax = -k * p.x - d * p.vx;
        const ay = -k * p.y - d * p.vy;
        p.vx += ax;
        p.vy += ay;
        p.x += p.vx;
        p.y += p.vy;

        if (Math.abs(p.x) > 0.1 || Math.abs(p.y) > 0.1 || Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
          needsUpdate = true;
        } else {
          p.x = 0;
          p.y = 0;
          p.vx = 0;
          p.vy = 0;
        }
        return { x: p.x, y: p.y };
      });

      if (needsUpdate || activeDragIdx !== null) {
        setOffsets(nextOffsets);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [bounce, activeDragIdx]);

  // Handle letter click kick & ripple
  const handleLetterClick = useCallback(
    (index: number) => {
      if (!clickKick) return;
      playMechanicalClick(600 + (index % 8) * 40);

      // Kick target letter upward
      const p = physicsRef.current[index];
      if (p) {
        p.vy = -14.0;
      }

      // Ripple to neighbors with decaying impulse
      for (let dist = 1; dist <= 3; dist++) {
        const leftIdx = index - dist;
        const rightIdx = index + dist;
        const impulse = -14.0 * Math.pow(0.55, dist);
        setTimeout(() => {
          if (physicsRef.current[leftIdx]) physicsRef.current[leftIdx]!.vy += impulse;
          if (physicsRef.current[rightIdx]) physicsRef.current[rightIdx]!.vy += impulse;
        }, dist * 35);
      }
    },
    [clickKick]
  );

  // Pointer drag handling for draggable letters
  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLSpanElement>) => {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveDragIdx(index);
    dragStartRef.current = { clientX: e.clientX, clientY: e.clientY };
    playMechanicalClick(520);
  };

  const handlePointerMove = (index: number, e: React.PointerEvent<HTMLSpanElement>) => {
    if (activeDragIdx !== index || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    const p = physicsRef.current[index];
    if (p) {
      p.x = Math.max(-60, Math.min(60, dx));
      p.y = Math.max(-80, Math.min(80, dy));
      p.vx = 0;
      p.vy = 0;
    }
  };

  const handlePointerUp = (index: number) => {
    if (activeDragIdx === index) {
      setActiveDragIdx(null);
      dragStartRef.current = null;
      playMechanicalClick(660);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`tech-text-container relative inline-flex flex-wrap items-baseline select-none ${className}`}
      aria-label={text}
    >
      {/* Optional Technical Guide Lines (Baseline, X-Height, Cap-Height) */}
      {guides && (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 border-b border-dashed border-[#c4e22e]/25 opacity-60"
          aria-hidden="true"
        />
      )}

      {letters.map((char, idx) => {
        const isSpace = char === " ";
        const isHovered = hoveredIdx === idx;
        const isSweep = sweepIdx === idx;
        const isDragging = activeDragIdx === idx;
        const offset = offsets[idx] ?? { x: 0, y: 0 };

        if (isSpace) {
          return (
            <span
              key={`space-${idx}`}
              className="inline-block w-[0.32em] text-transparent"
              aria-hidden="true"
            >
              &nbsp;
            </span>
          );
        }

        const isHighlighted = isHovered || isSweep || isDragging;

        return (
          <span
            key={`char-${idx}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => handleLetterClick(idx)}
            onPointerDown={(e) => handlePointerDown(idx, e)}
            onPointerMove={(e) => handlePointerMove(idx, e)}
            onPointerUp={() => handlePointerUp(idx)}
            onPointerCancel={() => handlePointerUp(idx)}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              cursor: draggable ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            className={`group relative inline-flex items-center justify-center transition-colors duration-150 ${intro === "assemble" && !introFinished
              ? "animate-tech-assemble"
              : ""
              }`}
          >
            {/* Base Letter Glyph */}
            <span
              className={`relative z-10 transition-colors duration-150 ${isHighlighted
                ? "text-[#c4e22e] [text-shadow:0_0_12px_rgba(196,226,46,0.5)]"
                : ""
                }`}
            >
              {char}
            </span>

            {/* Selection Bounding Box & Corner Vector Metrics (Gliding Selection Box) */}
            {selection && isHighlighted && (
              <span
                className="pointer-events-none absolute -inset-x-1 -inset-y-1.5 z-20 rounded-[2px] border border-dashed border-[#c4e22e] bg-[#c4e22e]/10 shadow-[0_0_12px_rgba(196,226,46,0.3)] animate-pulse"
                aria-hidden="true"
              >
                {/* 4 Corner Crosshairs */}
                <span className="absolute -top-1 -left-1 h-1.5 w-1.5 border-t border-l border-[#c4e22e]" />
                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 border-t border-r border-[#c4e22e]" />
                <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border-b border-l border-[#c4e22e]" />
                <span className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border-b border-r border-[#c4e22e]" />
              </span>
            )}

            {/* Technical Metric Label Tag Above the Active Letter */}
            {labels && isHighlighted && (
              <span
                className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] border border-[#c4e22e]/60 bg-[#0c0d12] px-1 py-0.5 font-mono text-[8px] font-bold tracking-tight text-[#c4e22e] shadow-lg z-30"
                aria-hidden="true"
              >
                #{idx < 9 ? `0${idx + 1}` : idx + 1}
                {isDragging ? ` Δy:${Math.round(offset.y)}` : ""}
              </span>
            )}

            {/* Blinking Pixel Specks */}
            {specks > 0 && isHighlighted && (
              <span className="pointer-events-none absolute inset-0 z-0 overflow-visible" aria-hidden="true">
                {[...Array(Math.min(specks, 6))].map((_, sIdx) => {
                  const angle = (sIdx / 6) * Math.PI * 2;
                  const dist = 14 + (sIdx % 3) * 4;
                  const sx = Math.cos(angle) * dist;
                  const sy = Math.sin(angle) * dist;
                  return (
                    <span
                      key={sIdx}
                      style={{
                        transform: `translate(${sx}px, ${sy}px)`,
                        animationDelay: `${sIdx * 0.12}s`,
                      }}
                      className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-[#c4e22e] rounded-[0.5px] opacity-75 shadow-[0_0_4px_#c4e22e] animate-ping"
                    />
                  );
                })}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default TechText;

