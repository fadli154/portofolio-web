"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface DriftWallItem {
  id?: string;
  image: string;
  title?: string;
  href?: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
  category?: string;
  summary?: string;
  fileUrl?: string | null;
  verifyUrl?: string | null;
  raw?: unknown;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
  onTileClick?: (item: DriftWallItem) => void;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

const cx = (...parts: (string | false | undefined | null)[]) =>
  parts.filter(Boolean).join(" ");

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export const DriftWall = React.memo(function DriftWall({
  items = [],
  columns = 4,
  tileWidth = 260,
  tileHeight = 175,
  gap = 20,
  radius = 16,
  tilt = 14,
  turn = -12,
  roll = 0,
  perspective = 1200,
  depth = 100,
  speed = 36,
  direction = "up",
  variance = 0.4,
  parallax = 0.5,
  pauseOnHover = true,
  lift = 72,
  fade = 0.5,
  dim = 0.65,
  grayscale = false,
  overlayColor = "#000000",
  className = "",
  style,
  onTileClick,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(540);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const safeItems = useMemo(() => {
    if (items.length > 0) return items;
    return [
      {
        image: "/sertif/oase-juara-2-lit.webp",
        title: "Sertifikat OASE Juara 2 LIT",
      },
      {
        image: "/sertif/itsday-2025-lomba-website-umkm.webp",
        title: "Sertifikat IT's Day 2025",
      },
    ];
  }, [items]);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    safeItems.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : safeItems.slice(0, 1)));
  }, [safeItems, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      // Cover >= 1 full copyHeight above y=0 AND >= 2.2 * containerHeight below y=0
      // so shorter columns never run out of tiles at the bottom of the 3D tilted plane.
      const copies = Math.max(
        4,
        Math.ceil((containerHeight * 2.4 + copyHeight) / copyHeight) + 2
      );
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerHeight(entry.contentRect.height || 540);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, c) => meta.copyHeight * ((c * 0.37) % 1)
    );
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.16) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    if (reduced) {
      applyPlaneTransform(0, 0);
      for (let c = 0; c < trackRefs.current.length; c++) {
        const el = trackRefs.current[c];
        const meta = columnMeta[c];
        if (el && meta) {
          el.style.transform = `translate3d(0, ${-(meta.copyHeight + (offsetsRef.current[c] ?? 0))}px, 0)`;
        }
      }
      return;
    }

    let isVisible = true;
    const node = containerRef.current;

    const animate = (ts: number) => {
      rafRef.current = null;
      if (!isVisible) return;

      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x +=
        (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y +=
        (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(
        pointerDampedRef.current.x,
        pointerDampedRef.current.y
      );

      for (let c = 0; c < trackRefs.current.length; c++) {
        const meta = columnMeta[c];
        if (!meta) continue;
        const paused = wallHoveredRef.current && pauseOnHover;
        const factor = paused || hoveredColRef.current === c ? 0 : 1;
        const target = (baseVelocities[c] ?? 0) * factor;

        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[c] =
          (velocitiesRef.current[c] ?? 0) +
          (target - (velocitiesRef.current[c] ?? 0)) * ease;
        let next =
          (offsetsRef.current[c] ?? 0) + (velocitiesRef.current[c] ?? 0) * dt;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[c] = next;

        const el = trackRefs.current[c];
        if (el) el.style.transform = `translate3d(0, ${-(meta.copyHeight + next)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const observer =
      typeof IntersectionObserver !== "undefined" && node
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (isVisible && rafRef.current === null) {
                lastTsRef.current = null;
                rafRef.current = requestAnimationFrame(animate);
              }
            },
            { threshold: 0.05 }
          )
        : null;
    if (observer && node) observer.observe(node);

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      observer?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnMeta,
    pauseOnHover,
    parallax,
    reduced,
    applyPlaneTransform,
  ]);

  const activate = useCallback((id: string, index: number): void => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback((): void => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile =
        hit && hit.closest
          ? (hit.closest("[data-tile-id]") as HTMLElement | null)
          : null;
      if (!tile) return;
      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const fadePct = Math.max(0, Math.min(45, fade * 100));
  const maskStyle =
    fade > 0
      ? `linear-gradient(to bottom, transparent 0%, #000 ${fadePct}%, #000 ${100 - fadePct}%, transparent 100%)`
      : undefined;

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        "--dw-tile-w": `${tileWidth}px`,
        "--dw-tile-h": `${tileHeight}px`,
        "--dw-gap": `${gap}px`,
        "--dw-radius": `${radius}px`,
        "--dw-lift": `${lift}px`,
        "--dw-dim": dim,
        "--dw-gray": grayscale ? 1 : 0,
        "--dw-overlay": overlayColor,
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 50%",
        ...(maskStyle
          ? {
              WebkitMaskImage: maskStyle,
              maskImage: maskStyle,
            }
          : {}),
        ...style,
      }) as CSSProperties,
    [
      tileWidth,
      tileHeight,
      gap,
      radius,
      lift,
      dim,
      grayscale,
      overlayColor,
      fade,
      perspective,
      maskStyle,
      style,
    ]
  );

  const tileClass = cx(
    "group/tile relative block flex-none cursor-pointer outline-none",
    "w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]"
  );

  const innerClass = cx(
    "pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#181a1f] border border-white/10",
    "rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]",
    "transition-[transform,opacity,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))] group-[.is-active]/tile:border-[#c4e22e]",
    "group-[.is-active]/tile:shadow-[0_28px_65px_-18px_rgba(0,0,0,0.8),0_0_0_1px_rgba(196,226,46,0.35)]",
    "group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))] group-focus-visible/tile:border-[#c4e22e]",
    "group-focus-visible/tile:shadow-[0_28px_65px_-18px_rgba(0,0,0,0.8),0_0_0_2px_#c4e22e]"
  );

  const imgClass = cx(
    "block h-full w-full select-none object-cover",
    "[filter:grayscale(var(--dw-gray))_saturate(0.9)]",
    "transition-[filter,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.08)] group-[.is-active]/tile:scale-[1.03]",
    "group-focus-visible/tile:[filter:grayscale(0)_saturate(1.08)] group-focus-visible/tile:scale-[1.03]"
  );

  const overlayClass = cx(
    "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60",
    "transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "group-[.is-active]/tile:opacity-20 group-focus-visible/tile:opacity-20"
  );

  const labelClass = cx(
    "pointer-events-none absolute bottom-0 inset-x-0 p-3 flex flex-col justify-end text-left",
    "transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const inner = (
      <span className={innerClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title ?? "Sertifikat"}
          width={tileWidth}
          height={tileHeight}
          loading="eager"
          decoding="sync"
          draggable={false}
          className={imgClass}
        />
        <span className={overlayClass} aria-hidden="true" />
        <span className={labelClass}>
          {item.issuer && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/75 line-clamp-1">
              {item.issuer}
              <span className="sr-only">, </span>
            </span>
          )}
          <span className="font-medium text-xs text-white line-clamp-1 drop-shadow-sm">
            {item.title}
          </span>
        </span>
      </span>
    );

    const commonProps = {
      className: cx(tileClass, activeId === id && "is-active"),
      "data-tile-id": id,
      "data-col": colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
      onClick: (e: React.MouseEvent) => {
        if (onTileClick) {
          e.preventDefault();
          playMechanicalClick(720);
          onTileClick(item);
        }
      },
    };

    if (item.href && !onTileClick) {
      return (
        <a
          key={id}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          {...commonProps}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        {...commonProps}
      >
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx(
        "relative h-full w-full overflow-hidden select-none",
        className
      )}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="region"
      aria-label="Interactive 3D Drift Wall of Certificates"
    >
      <div
        ref={planeRef}
        style={{ height: containerHeight }}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row items-start [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          if (!meta) return null;
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              className="relative h-full w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
export default DriftWall;

