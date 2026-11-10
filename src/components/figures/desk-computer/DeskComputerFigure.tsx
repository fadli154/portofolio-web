"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as k from "../../iso/iso-kit";
import { Dots, Line, Solid } from "../../iso/react/draw";

const WIDTH = 600;
const HEIGHT = 430;

const PLATE = { x: -100, y: -84, w: 210, d: 242, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

const CASE = { x: -62, y: -62, w: 124, d: 118, r: 8 };
const FRONT = CASE.y + CASE.d;
const SIDE = CASE.x + CASE.w;
const PLINTH_H = 5;
const TOP = 170;
const SEAM = FRONT - 12;

const BEZEL = { x0: -48, x1: 48, z0: 68, z1: 158, r: 6, depth: 1.6 };
const CRT = { x0: -40, x1: 40, z0: 77, z1: 150, r: 8, depth: 5 };
const CRT_MID = (CRT.z0 + CRT.z1) / 2;
const SLOT = { x0: 8, x1: 46, z0: 45, z1: 50.5, r: 2.4, depth: 4 };

const KB = { x: -76, y: 84, w: 152, d: 58, r: 4 };
const KB_Z = 1.6;
const KB_TOP = 8.6;
const U = 9.2;
const KEYS_X = -U * 7.5;
const KEYS_Y = 88.5;

const ROWS: [string, number][][] = [
  [
    ["`", 1],
    ["1", 1],
    ["2", 1],
    ["3", 1],
    ["4", 1],
    ["5", 1],
    ["6", 1],
    ["7", 1],
    ["8", 1],
    ["9", 1],
    ["0", 1],
    ["-", 1],
    ["=", 1],
    ["Backspace", 2],
  ],
  [
    ["Tab", 1.5],
    ["q", 1],
    ["w", 1],
    ["e", 1],
    ["r", 1],
    ["t", 1],
    ["y", 1],
    ["u", 1],
    ["i", 1],
    ["o", 1],
    ["p", 1],
    ["[", 1],
    ["]", 1],
    ["\\", 1.5],
  ],
  [
    ["CapsLock", 1.75],
    ["a", 1],
    ["s", 1],
    ["d", 1],
    ["f", 1],
    ["g", 1],
    ["h", 1],
    ["j", 1],
    ["k", 1],
    ["l", 1],
    [";", 1],
    ["'", 1],
    ["Enter", 2.25],
  ],
  [
    ["Shift", 2.25],
    ["z", 1],
    ["x", 1],
    ["c", 1],
    ["v", 1],
    ["b", 1],
    ["n", 1],
    ["m", 1],
    [",", 1],
    [".", 1],
    ["/", 1],
    ["ShiftRight", 2.75],
  ],
  [
    ["Alt", 1.5],
    ["Meta", 1.5],
    [" ", 9],
    ["NumpadEnter", 1.5],
    ["AltRight", 1.5],
  ],
];
const ROW_H = [5.6, 5.2, 4.8, 4.4, 4];

const PORT = { y: 28, z: 9 };
const COIL = { x: 80, z: 3.6, r: 3.2, from: 44, to: 84, turns: 17 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(CASE, 0, TOP)],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 56 },
);

const at = (point: k.Point3) => k.iso(point, P);
const byDepth = (points: k.Plane[]) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = (y: number) => k.sideMatrix([0, y], 0, P, "left");
const flat = (x0: number, z0: number, x1: number, z1: number, r: number, steps = 6) =>
  k.pathOf(
    k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]),
    true,
  );
const sideSlot = (y: number, z0: number, z1: number, half = 0.8) =>
  k.pathOf(
    k.roundedPlan({ x: y - half, y: z0, w: half * 2, d: z1 - z0, r: half }, 4).map(([u, z]) =>
      at([SIDE, u, z]),
    ),
    true,
  );

interface KeyGeom {
  index: number;
  code: string;
  solid: k.SolidPaths;
  dish: string;
}

const KEY_GEOMS: KeyGeom[] = [];
const KEYS: string[] = [];
ROWS.forEach((row, r) => {
  let x = KEYS_X;
  for (const [code, width] of row) {
    const plan = { x: x + 0.7, y: KEYS_Y + r * U + 0.7, w: width * U - 1.4, d: U - 1.4, r: 1.4 };
    const h = ROW_H[r]!;
    const index = KEYS.length;
    KEYS.push(code);
    const dish =
      code === " "
        ? k.planOutline(k.insetPlan(plan, 1.8), KB_TOP + h, P, 3)
        : k.planOutline(k.insetPlan(plan, 1.6), KB_TOP + h, P, 3);
    KEY_GEOMS.push({
      index,
      code,
      solid: k.slabOf(plan, KB_TOP, h, P, 3, 0.4),
      dish,
    });
    x += width * U;
  }
});

interface RecessGeom {
  clipId: string;
  y: number;
  depth: number;
  shape: string;
  topPath: string;
  shadePaths: string[];
}

function computeRecess(
  clipId: string,
  { x0, x1, z0, z1, r, depth }: { x0: number; x1: number; z0: number; z1: number; r: number; depth: number },
  y: number,
): RecessGeom {
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops: string[] = [];
  const sides: [string[], string[], string[], string[]] = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length]!;
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4))) as 0 | 1 | 2 | 3].push(quad);
  });
  return {
    clipId,
    y,
    depth,
    shape: flat(x0, z0, x1, z1, r),
    topPath: tops.join(""),
    shadePaths: sides.map((s) => s.join("")),
  };
}

const BEZEL_RECESS = computeRecess("pc-clip-bezel", BEZEL, FRONT);
const CRT_RECESS = computeRecess("pc-clip-crt", CRT, FRONT - BEZEL.depth);
const SLOT_RECESS = computeRecess("pc-clip-slot", SLOT, FRONT);

const H = 19;
const LOGO_LEFT = -H * 0.61;
const LOGO_BASE = CRT_MID + 2;
const glyph = (points: [number, number][]) =>
  k.pathOf(
    points.map(([gx, gy]) => [LOGO_LEFT + gx * H, -(LOGO_BASE + gy * H)]),
    true,
  );
const LOGO_PATH =
  glyph([
    [0, 0],
    [0.37, 1],
    [0.55, 1],
    [0.92, 0],
    [0.71, 0],
    [0.63, 0.23],
    [0.29, 0.23],
    [0.21, 0],
  ]) +
  glyph([
    [0.35, 0.41],
    [0.57, 0.41],
    [0.46, 0.72],
  ]) +
  glyph([
    [0.68, 1],
    [0.89, 1],
    [1.26, 0],
    [1.05, 0],
  ]);

const SCAN_LINES: string[] = [];
for (let z = CRT.z0 + 1.2; z < CRT.z1; z += 1.6) {
  SCAN_LINES.push(`M${CRT.x0} ${(-z).toFixed(1)}H${CRT.x1}`);
}
const SCAN_PATH = SCAN_LINES.join("");
const GLOW_PATH = flat(-30, CRT.z0 + 8, 30, CRT.z1 - 8, 26, 10);
const TEXT_X = CRT.x0 + 8;
const TEXT_Z = CRT.z0 + 14;

const PLATE_FEET = byDepth(k.corners(PLATE, 22)).map(([x, y], idx) => ({
  id: idx,
  lo: k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28),
  mid: k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28),
}));
const PLATE_SLAB = k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6);
const PLATE_INSET = k.planOutline(k.insetPlan(PLATE, 5), 0, P);
const PLATE_SCREWS = k.corners(PLATE, 10);
const PLATE_SCREW_RINGS = PLATE_SCREWS.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join("");
const PLATE_SCREW_DOTS = PLATE_SCREWS.map(([x, y]) => at([x, y, 0]));
const LABEL_PLAN = { x: -88, y: 144, w: 40, d: 9, r: 1.2 };
const LABEL_SLAB = k.slabOf(LABEL_PLAN, 0, 0.8, P, 3);
const LABEL_LINES = [30, 22]
  .map((w, i) => k.lineOnTop([LABEL_PLAN.x + 4, LABEL_PLAN.y + 3 + i * 3], [LABEL_PLAN.x + 4 + w, LABEL_PLAN.y + 3 + i * 3], 0.8, P))
  .join("");

const CASE_PLINTH = k.slabOf(k.insetPlan(CASE, 3), 0, PLINTH_H, P, 8);
const CASE_BODY = k.slabOf(CASE, PLINTH_H, TOP - PLINTH_H, P, 8, 1.6);
const HANDLE_PLAN = { x: -42, y: CASE.y + 7, w: 84, d: 11, r: 5.5 };
const TOP_VENTS = Array.from({ length: 7 }, (_, i) =>
  k.planOutline({ x: -34, y: CASE.y + 27.3 + i * 3.4, w: 68, d: 1.4, r: 0.7 }, TOP, P, 4),
).join("");
const CASE_SEAM =
  k.lineOnTop([CASE.x, SEAM], [SIDE, SEAM], TOP, P) + k.segment([SIDE, SEAM, TOP], [SIDE, SEAM, PLINTH_H], P);
const rowOf = (from: number, to: number) =>
  Array.from({ length: Math.floor((to - from) / 3.2 + 1e-9) + 1 }, (_, i) => from + i * 3.2);
const SIDE_SLOTS_UPPER = rowOf(CASE.y + 10, CASE.y + 52)
  .map((y) => sideSlot(y, TOP - 48, TOP - 14))
  .join("");
const SIDE_SLOTS_LOWER = rowOf(CASE.y + 10, CASE.y + 40)
  .map((y) => sideSlot(y, 20, 30))
  .join("");
const SPEAKER_GRILLE = Array.from({ length: 9 }, (_, i) => flat(-46.7 + i * 3, 42, -45.3 + i * 3, 54, 0.7, 4)).join(
  "",
);

const ROCKER_Y = CASE.y + 8;
const ROCKER_BASE = k.slabOf({ x: SIDE, y: ROCKER_Y, w: 1.2, d: 12, r: 1 }, 12, 15, P, 3);
const rockerHalf = (z: number, proud: boolean) =>
  k.slabOf({ x: SIDE + 1.2, y: ROCKER_Y + 1.5, w: proud ? 2.4 : 0.8, d: 9, r: 0.6 }, z, 5.6, P, 2);

const PORT_A = k.slabOf({ x: SIDE - 0.4, y: PORT.y - 1, w: 1.4, d: 10, r: 1 }, PORT.z - 1, 9, P, 3);
const PORT_B = k.slabOf({ x: SIDE + 1, y: PORT.y, w: 4.4, d: 8, r: 1 }, PORT.z, 7, P, 3, 0.4);
const PORT_C = k.slabOf({ x: SIDE + 5.4, y: PORT.y + 2, w: 5, d: 4, r: 1.6 }, PORT.z + 1.5, 4, P, 4);

const KB_FEET = byDepth(k.corners(KB, 8)).map(([x, y], idx) => ({
  id: idx,
  cyl: k.cylinder(x, y, 2.8, 0, KB_Z, P, 16),
}));
const KB_BODY = k.slabOf(KB, KB_Z, KB_TOP - KB_Z, P, 6, 1);
const KB_WELL = k.planOutline({ x: KEYS_X - 1.4, y: KEYS_Y - 1.4, w: U * 15 + 2.8, d: U * 5 + 2.8, r: 2 }, KB_TOP, P, 4);
const KB_PLUG = k.slabOf({ x: KB.x + KB.w, y: 90, w: 4, d: 4, r: 1.5 }, 2.5, 4, P, 4);

const CORD_START: k.Point3 = [COIL.x + COIL.r, COIL.from, COIL.z];
const CORD_END: k.Point3 = [COIL.x + COIL.r, COIL.to, COIL.z];
const CORD_A = k.pathOf(
  (
    [
      [SIDE + 10.4, PORT.y + 4, PORT.z + 3.5],
      [SIDE + 14, PORT.y + 6, PORT.z + 2.4],
      [SIDE + 17, PORT.y + 9.5, PORT.z - 1],
      [SIDE + 19.6, PORT.y + 13, COIL.z + 1.6],
      CORD_START,
    ] as k.Point3[]
  ).map((pt) => at(pt)),
);
const CORD_SPRING = k.coil(COIL.from, COIL.to, [COIL.x, COIL.z], COIL.r, COIL.turns, "y", P);
const CORD_B = k.pathOf(
  (
    [
      CORD_END,
      [COIL.x + 2.6, COIL.to + 3, COIL.z + 0.2],
      [KB.x + KB.w + 6.4, 91.4, 4.4],
      [KB.x + KB.w + 4, 92, 4.5],
    ] as k.Point3[]
  ).map((pt) => at(pt)),
);

const PHRASES = ["fadli --bio", "php artisan serve", "python smart_hajj.py"];
const MAX_CHARS = 20;
const DOWN_VEC = k.axisVector(P, [0, 0, -1]);
const DOWN_DIST = 2.2;

const SHIFTED: Record<string, string> = {
  "~": "`",
  "!": "1",
  "@": "2",
  "#": "3",
  $: "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  _: "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

export function DeskComputerFigure({ locale = "id" }: { locale?: "id" | "en" }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [readoutText, setReadoutText] = useState("on · 0 chars");
  const [powerState, setPowerState] = useState(true);
  const apiRef = useRef<{
    typePhrase: (phrase: string) => void;
    togglePower: () => void;
  } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg) return;

    const keyEls = KEYS.map((_, i) => svg.querySelector<SVGGElement>(`[data-key="${i}"]`));
    const textEl = svg.querySelector<SVGTextElement>('[data-part="text"]');
    const cursorEl = svg.querySelector<SVGRectElement>('[data-part="cursor"]');
    const crtEl = svg.querySelector<SVGGElement>('[data-part="crt"]');
    const beamEl = svg.querySelector<SVGPathElement>('[data-part="beam"]');
    const dotEl = svg.querySelector<SVGCircleElement>('[data-part="dot"]');
    const glassEl = svg.querySelector<SVGPathElement>(".pc-glass");
    const ledEl = svg.querySelector<SVGGElement>('[data-part="led"]');
    const rockerOn = svg.querySelector<SVGGElement>('[data-rocker="on"]');
    const rockerOff = svg.querySelector<SVGGElement>('[data-rocker="off"]');

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const keyState = KEYS.map(() => ({ at: 0, held: 0 }));
    const active = new Set<number>();

    let line = "";
    let lastKey = "";
    let power = 1;
    let powerClock = 9;
    let visible = true;
    let touring = !still.matches;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let tour = { phrase: 0, step: "type" as "type" | "erase" | "off" | "on", index: 0, wait: 1.0 };

    const indexOf = (code: string) => KEYS.indexOf(code);

    const write = () => {
      if (textEl) textEl.textContent = "> " + line;
      if (cursorEl && textEl) {
        let len = line.length * 3.1 + 6.2;
        try {
          len = textEl.getComputedTextLength();
        } catch {
          // fallback if offscreen
        }
        cursorEl.setAttribute("x", String(TEXT_X + len + 0.6));
      }
      const nextReadout = power
        ? `on · ${line.length} chars${lastKey ? ` · key ${lastKey}` : ""}`
        : "off";
      setReadoutText(nextReadout);
    };

    const press = (code: string, hold = 0.09) => {
      const i = indexOf(code);
      if (i < 0) return;
      keyState[i]!.held = hold;
      active.add(i);
    };

    const typeChar = (char: string) => {
      if (!power) return;
      const lower = char.toLowerCase();
      const code = SHIFTED[char] || lower;
      if (indexOf(code) < 0) return;
      if (SHIFTED[char] || char !== lower) press("Shift", 0.14);
      press(code);
      lastKey = char === " " ? "space" : char;
      if (line.length < MAX_CHARS) line += char;
      write();
    };

    const erase = () => {
      if (!power) return;
      press("Backspace");
      lastKey = "backspace";
      line = line.slice(0, -1);
      write();
    };

    const enter = () => {
      if (!power) return;
      press("Enter");
      lastKey = "return";
      line = "";
      write();
    };

    const setPower = (next: number) => {
      if (next === power) return;
      power = next;
      setPowerState(Boolean(power));
      powerClock = still.matches ? 9 : 0;
      if (rockerOn) rockerOn.style.display = power ? "" : "none";
      if (rockerOff) rockerOff.style.display = power ? "none" : "";
      if (ledEl) ledEl.style.opacity = power ? "" : "0.15";
      write();
    };

    const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

    const crtFrame = () => {
      const t = powerClock;
      let sx = 1;
      let sy = 1;
      let beamAt = 0;
      let dotAt = 0;
      let lit = power;
      if (power) {
        if (t < 0.14) {
          sx = ease(t / 0.14);
          sy = 0.012;
          beamAt = 1;
        } else if (t < 0.36) {
          sy = 0.012 + 0.988 * ease((t - 0.14) / 0.22);
          beamAt = 1 - ease((t - 0.14) / 0.22);
        }
      } else {
        if (t < 0.1) {
          sy = 1 - 0.988 * ease(t / 0.1);
          beamAt = ease(t / 0.1);
          lit = 1;
        } else if (t < 0.26) {
          sy = 0.012;
          sx = 1 - ease((t - 0.1) / 0.16);
          beamAt = 1;
          lit = 1;
        } else {
          sx = 0;
          sy = 0;
          dotAt = Math.max(0, 1 - (t - 0.26) / 0.5);
        }
      }
      if (crtEl) {
        crtEl.setAttribute(
          "transform",
          `translate(0 ${-CRT_MID}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(0 ${CRT_MID})`,
        );
      }
      if (beamEl) {
        beamEl.setAttribute(
          "transform",
          `translate(0 ${-CRT_MID}) scale(${Math.max(sx, 0.001).toFixed(3)} 1) translate(0 ${CRT_MID})`,
        );
        beamEl.style.opacity = beamAt.toFixed(2);
      }
      if (dotEl) dotEl.style.opacity = dotAt.toFixed(2);
      if (glassEl) glassEl.toggleAttribute("data-on", Boolean(lit));
    };

    const tourStep = (dt: number) => {
      tour.wait -= dt;
      if (tour.wait > 0) return;
      const phrase = PHRASES[tour.phrase]!;
      if (tour.step === "type") {
        if (tour.index < phrase.length) {
          typeChar(phrase[tour.index++]!);
          tour.wait = 0.09 + Math.random() * 0.09;
        } else {
          tour.step = "erase";
          tour.wait = 2.2;
        }
      } else if (tour.step === "erase") {
        if (line.length) {
          erase();
          tour.wait = 0.055;
        } else {
          tour.phrase = (tour.phrase + 1) % PHRASES.length;
          tour.index = 0;
          tour.step = "type";
          tour.wait = 0.7;
        }
      }
    };

    const takeOver = (switching = false) => {
      if (touring) {
        touring = false;
        tour = { phrase: 0, step: "type", index: 0, wait: 1.2 };
        line = "";
        if (!switching) setPower(1);
        write();
      }
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (still.matches) return;
        touring = true;
        line = "";
        setPower(1);
        write();
      }, 9000);
    };

    apiRef.current = {
      typePhrase: (phrase: string) => {
        takeOver();
        setPower(1);
        line = "";
        write();
        phrase.split("").forEach((ch, idx) => {
          setTimeout(() => typeChar(ch), idx * 55);
        });
      },
      togglePower: () => {
        takeOver(true);
        setPower(power ? 0 : 1);
      },
    };

    const onTick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      const dt = Math.min(Math.max(deltaTime, 0) / 1000 || 1 / 60, 1 / 20);
      const calm = still.matches;
      if (touring && !calm) tourStep(dt);
      powerClock += dt;
      crtFrame();

      for (const i of active) {
        const s = keyState[i]!;
        s.held = Math.max(0, s.held - dt);
        const want = s.held > 0 ? DOWN_DIST : 0;
        s.at = calm ? want : s.at + (want - s.at) * (1 - Math.exp(-dt / (want ? 0.025 : 0.07)));
        if (Math.abs(want - s.at) < 0.01) s.at = want;
        const el = keyEls[i];
        if (el) {
          el.setAttribute(
            "transform",
            `translate(${(DOWN_VEC[0] * s.at).toFixed(2)} ${(DOWN_VEC[1] * s.at).toFixed(2)})`,
          );
          el.toggleAttribute("data-down", s.at > 0.6);
        }
        if (!s.held && s.at === 0) active.delete(i);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? false;
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(stage);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key;
      if (key === "Tab") return;
      takeOver(key === "Escape");
      if (key === "Escape") {
        event.preventDefault();
        setPower(power ? 0 : 1);
        return;
      }
      if (key === "Backspace") {
        event.preventDefault();
        erase();
        return;
      }
      if (key === "Enter") {
        event.preventDefault();
        enter();
        return;
      }
      if (key === "Shift") {
        press(event.code === "ShiftRight" ? "ShiftRight" : "Shift", 0.14);
        return;
      }
      if (key.length === 1) {
        event.preventDefault();
        typeChar(key);
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const keyNode = target.closest<SVGGElement>("[data-key]");
      if (keyNode) {
        takeOver();
        const code = KEYS[Number(keyNode.dataset.key)];
        if (code) {
          if (code.length === 1) typeChar(code);
          else if (code === "Backspace") erase();
          else if (code === "Enter" || code === "NumpadEnter") enter();
          else press(code);
        }
        stage.focus({ preventScroll: true });
        return;
      }
      if (target.closest('[data-part="computer"]')) {
        takeOver(true);
        setPower(power ? 0 : 1);
        stage.focus({ preventScroll: true });
      }
    };

    stage.addEventListener("keydown", onKeyDown);
    svg.addEventListener("click", onClick);
    write();
    crtFrame();
    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      io.disconnect();
      stage.removeEventListener("keydown", onKeyDown);
      svg.removeEventListener("click", onClick);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <figure className="iso-figure iso" data-theme="light">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">
            Fig 1
          </span>
          <span className="iso-plate-corner" data-corner="title">
            {locale === "id" ? "Workstation Pengembang Interaktif" : "Interactive Developer Workstation"}
          </span>
          <span className="iso-plate-corner" data-corner="hint">
            {locale === "id" ? "Klik tombol keyboard atau ketik langsung" : "Click keys or type directly"}
          </span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">
            {readoutText}
          </span>
        </div>

        <div
          ref={stageRef}
          className="iso-stage"
          tabIndex={0}
          role="group"
          aria-label={
            locale === "id"
              ? "Workstation komputer isometrik. Fokuskan dan ketik untuk menulis di layar monitor."
              : "Isometric desk computer. Focus and type to write on its screen."
          }
        >
          <svg
            ref={svgRef}
            className="iso-svg"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="group"
            aria-label="Isometric developer desk computer with 58 interactive keys and CRT display"
            focusable="false"
          >
            {/* Base Plate */}
            <path className="iso-halo" d={k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)} />
            {PLATE_FEET.map((foot) => (
              <React.Fragment key={foot.id}>
                <Solid paths={foot.lo} tone="lo" />
                <Solid paths={foot.mid} tone="mid" />
              </React.Fragment>
            ))}
            <Solid paths={PLATE_SLAB} tone="mid" />
            <Line d={PLATE_INSET} tone="lo" />
            <Line d={PLATE_SCREW_RINGS} tone="lo" />
            <Dots points={PLATE_SCREW_DOTS} size={0.5} />
            <Solid paths={LABEL_SLAB} tone="lo" crease="none" />
            <Line d={LABEL_LINES} tone="lo" free />
            <Dots points={[at([LABEL_PLAN.x + LABEL_PLAN.w - 3, LABEL_PLAN.y + LABEL_PLAN.d / 2, 0.8])]} size={0.45} />

            {/* Computer Case */}
            <g className="pc-computer" data-part="computer">
              <path className="iso-halo" d={k.haloOf(CASE, 0, 8, P)} />
              <Solid paths={CASE_PLINTH} tone="lo" />
              <Solid paths={CASE_BODY} tone="mid" />
              <Line d={k.planOutline(HANDLE_PLAN, TOP, P, 8)} tone="lo" />
              <Line d={k.planOutline(k.insetPlan(HANDLE_PLAN, 2.2), TOP, P, 8)} tone="faint" />
              <Line d={TOP_VENTS} tone="faint" />
              <Line d={CASE_SEAM} tone="lo" />
              <Line d={SIDE_SLOTS_UPPER} tone="faint" />
              <Line d={SIDE_SLOTS_LOWER} tone="faint" />
              <g transform={planeOf(FRONT)}>
                <path className="iso-line" data-tone="faint" d={flat(CASE.x + 4, PLINTH_H + 4, SIDE - 4, TOP - 4, 5)} />
              </g>

              {/* Bezel + CRT Recess */}
              <clipPath id={BEZEL_RECESS.clipId}>
                <path transform={planeOf(BEZEL_RECESS.y)} d={BEZEL_RECESS.shape} />
              </clipPath>
              <g clipPath={`url(#${BEZEL_RECESS.clipId})`}>
                <path className="iso-top" d={BEZEL_RECESS.topPath} />
                {BEZEL_RECESS.shadePaths.map((d, shade) =>
                  d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null,
                )}
                <g transform={planeOf(BEZEL_RECESS.y - BEZEL_RECESS.depth)}>
                  <path className="pc-bezel" d={BEZEL_RECESS.shape} />
                  <path className="iso-line" data-tone="faint" d={BEZEL_RECESS.shape} />
                </g>

                <clipPath id={CRT_RECESS.clipId}>
                  <path transform={planeOf(CRT_RECESS.y)} d={CRT_RECESS.shape} />
                </clipPath>
                <g clipPath={`url(#${CRT_RECESS.clipId})`}>
                  <path className="iso-top" d={CRT_RECESS.topPath} />
                  {CRT_RECESS.shadePaths.map((d, shade) =>
                    d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null,
                  )}
                  <g transform={planeOf(CRT_RECESS.y - CRT_RECESS.depth)}>
                    <path className="pc-glass" data-on="" d={CRT_RECESS.shape} />
                    <g data-part="crt">
                      <path className="pc-glow" d={GLOW_PATH} />
                      <path className="pc-scan" d={SCAN_PATH} />
                      <path className="pc-logo" d={LOGO_PATH} />
                      <text className="pc-text" data-part="text" x={TEXT_X} y={-TEXT_Z} fontSize={5.2}>
                        &gt;{" "}
                      </text>
                      <rect
                        className="pc-cursor"
                        data-part="cursor"
                        x={TEXT_X + 6.6}
                        y={-TEXT_Z - 4.2}
                        width={3}
                        height={5}
                      />
                    </g>
                    <path
                      className="pc-beam"
                      data-part="beam"
                      d={`M${CRT.x0 + 4} ${-CRT_MID}H${CRT.x1 - 4}`}
                      style={{ opacity: 0 }}
                    />
                    <circle className="pc-dot" data-part="dot" cx={0} cy={-CRT_MID} r={1.4} style={{ opacity: 0 }} />
                    <path
                      className="iso-line"
                      data-tone="lo"
                      d={`M${CRT.x0 + 6} ${-(CRT.z1 - 16)}Q${CRT.x0 + 7} ${-(CRT.z1 - 7)} ${CRT.x0 + 16} ${-(CRT.z1 - 6)}`}
                    />
                    <path className="iso-line" data-tone="faint" d={CRT_RECESS.shape} />
                  </g>
                </g>
                <g transform={planeOf(CRT_RECESS.y)}>
                  <path className="iso-line" data-tone="lo" d={CRT_RECESS.shape} />
                </g>
              </g>
              <g transform={planeOf(BEZEL_RECESS.y)}>
                <path className="iso-line" data-tone="lo" d={BEZEL_RECESS.shape} />
              </g>

              {/* Floppy Slot Recess */}
              <clipPath id={SLOT_RECESS.clipId}>
                <path transform={planeOf(SLOT_RECESS.y)} d={SLOT_RECESS.shape} />
              </clipPath>
              <g clipPath={`url(#${SLOT_RECESS.clipId})`}>
                <path className="iso-top" d={SLOT_RECESS.topPath} />
                {SLOT_RECESS.shadePaths.map((d, shade) =>
                  d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null,
                )}
                <g transform={planeOf(SLOT_RECESS.y - SLOT_RECESS.depth)}>
                  <path className="pc-dark" d={SLOT_RECESS.shape} />
                  <path className="iso-line" data-tone="lo" d={`M${SLOT.x0} ${-(SLOT.z0 + 1.6)}H${SLOT.x1}`} />
                  <path className="iso-line" data-tone="faint" d={SLOT_RECESS.shape} />
                </g>
              </g>
              <g transform={planeOf(SLOT_RECESS.y)}>
                <path className="iso-line" data-tone="lo" d={SLOT_RECESS.shape} />
              </g>

              <Dots points={[at([SLOT.x1 + 4, FRONT, SLOT.z0 - 1])]} size={0.5} tone="mid" />
              <g transform={planeOf(FRONT)}>
                <Line d={SPEAKER_GRILLE} tone="lo" />
              </g>
              <g data-part="led">
                <Dots points={[at([-46, FRONT, 36])]} size={0.8} tone="hi" />
              </g>

              {/* Rocker Switch */}
              <Solid paths={ROCKER_BASE} tone="mid" />
              <g data-rocker="on">
                <Solid paths={rockerHalf(13, true)} tone="mid" />
                <Solid paths={rockerHalf(20.4, false)} tone="mid" />
              </g>
              <g data-rocker="off" style={{ display: "none" }}>
                <Solid paths={rockerHalf(20.4, true)} tone="mid" />
                <Solid paths={rockerHalf(13, false)} tone="mid" />
              </g>

              {/* Side Port */}
              <Solid paths={PORT_A} tone="lo" />
              <Solid paths={PORT_B} tone="mid" />
              <Solid paths={PORT_C} tone="mid" />
              <Dots
                points={[at([SIDE + 3.2, PORT.y + 1.6, PORT.z + 7]), at([SIDE + 3.2, PORT.y + 6.4, PORT.z + 7])]}
                size={0.4}
              />
            </g>

            {/* Keyboard */}
            <path className="iso-halo" d={k.haloOf(KB, 0, 4, P)} />
            {KB_FEET.map((foot) => (
              <Solid key={foot.id} paths={foot.cyl} tone="lo" />
            ))}
            <Solid paths={KB_BODY} tone="mid" />
            <Line d={KB_WELL} tone="lo" />
            <Dots points={[at([KB.x + 4, KB.y + 2.4, KB_TOP]), at([KB.x + KB.w - 4, KB.y + 2.4, KB_TOP])]} size={0.45} />
            {KEY_GEOMS.map((key) => (
              <g key={key.index} className="pc-key" data-key={key.index}>
                <Solid paths={key.solid} tone="mid" crease="faint" />
                <Line d={key.dish} tone="faint" />
              </g>
            ))}
            <Solid paths={KB_PLUG} tone="mid" />

            {/* Coiled Cable */}
            <path className="iso-line pc-cord" data-tone="mid" d={CORD_A} />
            <Line d={CORD_SPRING.back} tone="lo" />
            <Line d={CORD_SPRING.front} tone="mid" />
            <path className="iso-line pc-cord" data-tone="mid" d={CORD_B} />
          </svg>
        </div>
      </div>

      {/* Interactive Quick Controls (below plate so 4-corner labels stay unobstructed) */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--rule)] bg-[var(--bg)] px-4 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-[var(--ink-muted)]">
            {locale === "id" ? "Uji Ketik Cepat:" : "Quick Type:"}
          </span>
          <button
            type="button"
            onClick={() => apiRef.current?.typePhrase("fadli --bio")}
            className="rounded-md border border-[var(--rule-strong)] bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            $ fadli --bio
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.typePhrase("php artisan serve")}
            className="rounded-md border border-[var(--rule-strong)] bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            $ php artisan serve
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.typePhrase("python smart_hajj.py")}
            className="rounded-md border border-[var(--rule-strong)] bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            $ python smart_hajj.py
          </button>
        </div>
        <button
          type="button"
          onClick={() => apiRef.current?.togglePower()}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--rule-strong)] bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
        >
          <span
            className={`h-2 w-2 rounded-full ${powerState ? "bg-emerald-600" : "bg-slate-400"}`}
            aria-hidden="true"
          />
          {locale === "id" ? (powerState ? "Layar: Menyala" : "Layar: Mati") : powerState ? "CRT: On" : "CRT: Off"}
        </button>
      </div>
      <figcaption className="iso-legend">
        <span className="iso-caption">
          {locale === "id"
            ? "Workstation isometrik interaktif dengan 58 tombol mekanik dan kabel spiral. Klik tombol pada gambar atau ketik langsung melalui keyboard Anda untuk menjalankan perintah di layar monitor."
            : "Interactive isometric workstation with 58 mechanical keys and coiled cord. Click keys on the drawing or type on your keyboard to write directly onto the CRT display."}
        </span>
      </figcaption>
    </figure>
  );
}
