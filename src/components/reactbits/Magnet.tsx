"use client";

import React, { useRef, useState } from "react";

interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnet({ children, strength = 0.24, className = "" }: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`,
        transition:
          pos.x === 0 && pos.y === 0
            ? "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 90ms linear",
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

