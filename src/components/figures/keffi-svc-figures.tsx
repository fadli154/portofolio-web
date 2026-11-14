"use client";

import * as React from "react";
import {
  axisVector,
  boxCorners,
  coil,
  corners,
  cylinder,
  dotGrid,
  fitProjection,
  insetPlan,
  iso,
  joinPaths,
  knurl,
  lineOnTop,
  pathOf,
  planOutline,
  radialTicks,
  ring,
  rise,
  segment,
  sideSeam,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type Plan,
  type Point3,
  type Projection,
} from "../iso/iso-kit";
import { Dots, FaceText, IsoFigure, Line, Solid, Wire } from "../iso/react/draw";
import { follow, spring, useLoop, type Spring } from "../iso/react/live";
import "../iso/iso.css";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

const WIDTH = 500;
const HEIGHT = 340;

interface StationSpec {
  code: string;
  label: string;
  readout: string;
}

function useInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function StationBar({
  stations,
  activeIdx,
  onSelect,
  darkMachine,
}: {
  stations: StationSpec[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  darkMachine: boolean;
}) {
  const current = stations[activeIdx] ?? stations[0]!;
  return (
    <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-current/15 pt-2.5 font-mono text-[11px]">
      <div className="flex flex-wrap gap-1.5">
        {stations.map((st, idx) => {
          const active = idx === activeIdx;
          return (
            <button
              key={st.code}
              type="button"
              onClick={() => onSelect(idx)}
              style={
                active
                  ? darkMachine
                    ? {
                        backgroundColor: "#c4e22e",
                        color: "#111213",
                        borderColor: "#c4e22e",
                      }
                    : {
                        backgroundColor: "#111213",
                        color: "#f5f5f2",
                        borderColor: "#111213",
                      }
                  : undefined
              }
              className={`rounded-full border px-3 py-1 transition ${
                active
                  ? "font-bold shadow-sm"
                  : "border-current/25 opacity-75 hover:opacity-100"
              }`}
            >
              {st.code} · {st.label}
            </button>
          );
        })}
      </div>
      <span className="font-semibold tracking-wider opacity-85">
        {current.readout}
      </span>
    </div>
  );
}

/* ============================================================================
   1. FRONTEND & WEB DEVELOPMENT
      Isometric Widescreen Studio Monitor Workstation + 3 Floating DOM Layers
   ============================================================================ */
const FE_BASE: Plan = { x: 0, y: 0, w: 118, d: 74, r: 7 };
const FE_PROJ: Projection = fitProjection(
  boxCorners({ x: -2, y: -4, w: 122, d: 82, r: 0 }, -3, 44),
  WIDTH,
  HEIGHT,
  { pad: 10, headroom: 4 }
);
const FE_AXIS_Y = axisVector(FE_PROJ, [0, 1, 0]);
const FE_AXIS_Z = axisVector(FE_PROJ, [0, 0, 1]);

const feDeskBase = slabOf(FE_BASE, 0, 5.5, FE_PROJ, 8, 0.7);
const feDeskSeam = sideSeam(FE_BASE, 1.8, FE_PROJ);
const feDeskInset = planOutline(insetPlan(FE_BASE, 2.8), 5.5, FE_PROJ);
const feFeet = corners(FE_BASE, 8).map(([cx, cy]) =>
  cylinder(cx, cy, 4.2, -2.4, 2.4, FE_PROJ, 20)
);
const feScrews = corners(FE_BASE, 5.5).map(([cx, cy]) => ({
  well: ring(cx, cy, 1.7, 5.5, FE_PROJ, 16),
  slot: lineOnTop([cx - 0.9, cy], [cx + 0.9, cy], 5.5, FE_PROJ),
}));

// Stand & Widescreen Monitor Housing at Back
const feStandBase = slabOf({ x: 40, y: 6, w: 38, d: 16, r: 3 }, 5.5, 2.4, FE_PROJ, 6, 0.4);
const feStandNeck = slabOf({ x: 52, y: 8, w: 14, d: 7, r: 1.5 }, 7.9, 10.5, FE_PROJ, 4);
const feMonitorShell = slabOf({ x: 14, y: 10, w: 90, d: 8.5, r: 3.2 }, 15.0, 26.0, FE_PROJ, 6, 0.7);
const feMonitorSeam = sideSeam({ x: 14, y: 10, w: 90, d: 8.5, r: 3.2 }, 28.0, FE_PROJ);
const feWebcam = cylinder(59, 14.2, 3.2, 41.0, 2.2, FE_PROJ, 20);
const feWebcamLens = ring(59, 14.2, 1.6, 43.2, FE_PROJ, 16);

// Recessed Monitor Screen Frame on Front Wall (y = 18.55)
const feScreenBezel = pathOf(
  [
    iso([18, 18.6, 18.0], FE_PROJ),
    iso([100, 18.6, 18.0], FE_PROJ),
    iso([100, 18.6, 38.2], FE_PROJ),
    iso([18, 18.6, 38.2], FE_PROJ),
  ],
  true
);
const feScreenGrid = joinPaths([
  segment([22, 18.65, 34.5], [96, 18.65, 34.5], FE_PROJ),
  segment([22, 18.65, 22.0], [96, 18.65, 22.0], FE_PROJ),
  segment([44, 18.65, 22.0], [44, 18.65, 34.5], FE_PROJ),
  segment([74, 18.65, 22.0], [74, 18.65, 34.5], FE_PROJ),
]);

// Mechanical Keyboard & Rotary Dial in Front
const feKeyboardDeck = slabOf({ x: 20, y: 50, w: 62, d: 17, r: 2.4 }, 5.5, 2.4, FE_PROJ, 6, 0.4);
const feKeycaps = Array.from({ length: 18 }, (_, idx) => {
  const col = idx % 6;
  const row = Math.floor(idx / 6);
  return slabOf(
    { x: 23.5 + col * 9.2, y: 52.2 + row * 4.6, w: 7.6, d: 3.6, r: 0.8 },
    7.9,
    1.1,
    FE_PROJ,
    4
  );
});
const feTrackpad = slabOf({ x: 86, y: 50.5, w: 15, d: 16, r: 2.2 }, 5.5, 1.8, FE_PROJ, 6, 0.3);
const feTrackpadInner = planOutline(insetPlan({ x: 86, y: 50.5, w: 15, d: 16, r: 2.2 }, 1.5), 7.3, FE_PROJ);
const feEncoderKnob = cylinder(12.5, 58, 4.2, 5.5, 3.6, FE_PROJ, 22);
const feEncoderKnurl = knurl(12.5, 58, 4.2, 5.5, 9.1, 16, FE_PROJ);
const feRulerTicks = topTicks(18, 100, 2, 5, 69.2, 5.5, [1.5, 3.0], FE_PROJ);

// 3 Floating Responsive UI Viewport Layers in Front of Monitor
// Layer 0: Desktop 12-Col Grid Card
const feLayerDesktop = {
  slab: slabOf({ x: 20, y: 23, w: 78, d: 5.0, r: 2.0 }, 16.5, 19.5, FE_PROJ, 6, 0.45),
  frame: pathOf(
    [
      iso([23, 28.05, 19.0], FE_PROJ),
      iso([95, 28.05, 19.0], FE_PROJ),
      iso([95, 28.05, 33.5], FE_PROJ),
      iso([23, 28.05, 33.5], FE_PROJ),
    ],
    true
  ),
  wireframe: joinPaths([
    segment([26, 28.1, 30.8], [92, 28.1, 30.8], FE_PROJ),
    segment([26, 28.1, 27.5], [56, 28.1, 27.5], FE_PROJ),
    segment([26, 28.1, 24.5], [48, 28.1, 24.5], FE_PROJ),
    segment([62, 28.1, 21.5], [92, 28.1, 28.5], FE_PROJ),
    segment([62, 28.1, 28.5], [92, 28.1, 21.5], FE_PROJ),
  ]),
  labelTf: topMatrix([24, 24.2], 36.0, FE_PROJ),
};

// Layer 1: Tablet Adaptive Split View
const feLayerTablet = {
  slab: slabOf({ x: 28, y: 32, w: 54, d: 4.8, r: 2.0 }, 14.0, 17.5, FE_PROJ, 6, 0.45),
  frame: pathOf(
    [
      iso([31, 36.85, 16.2], FE_PROJ),
      iso([79, 36.85, 16.2], FE_PROJ),
      iso([79, 36.85, 29.2], FE_PROJ),
      iso([31, 36.85, 29.2], FE_PROJ),
    ],
    true
  ),
  wireframe: joinPaths([
    segment([45, 36.9, 16.2], [45, 36.9, 29.2], FE_PROJ),
    segment([49, 36.9, 26.0], [75, 36.9, 26.0], FE_PROJ),
    segment([49, 36.9, 22.8], [71, 36.9, 22.8], FE_PROJ),
    segment([49, 36.9, 19.6], [68, 36.9, 19.6], FE_PROJ),
  ]),
  labelTf: topMatrix([31, 33.2], 31.5, FE_PROJ),
};

// Layer 2: Mobile 390px Viewport Card
const feLayerMobile = {
  slab: slabOf({ x: 46, y: 40.5, w: 30, d: 4.6, r: 2.2 }, 11.5, 16.5, FE_PROJ, 6, 0.45),
  frame: pathOf(
    [
      iso([48.5, 45.15, 13.5], FE_PROJ),
      iso([73.5, 45.15, 13.5], FE_PROJ),
      iso([73.5, 45.15, 25.8], FE_PROJ),
      iso([48.5, 45.15, 25.8], FE_PROJ),
    ],
    true
  ),
  wireframe: joinPaths([
    segment([57, 45.2, 24.4], [65, 45.2, 24.4], FE_PROJ),
    segment([51, 45.2, 21.2], [71, 45.2, 21.2], FE_PROJ),
    segment([51, 45.2, 18.2], [68, 45.2, 18.2], FE_PROJ),
    segment([55, 45.2, 15.0], [67, 45.2, 15.0], FE_PROJ),
  ]),
  labelTf: topMatrix([49, 41.6], 28.0, FE_PROJ),
};

const FE_STATIONS: StationSpec[] = [
  { code: "01", label: "1440PX DESKTOP", readout: "12-COL BENTO · SSR STREAM" },
  { code: "02", label: "768PX TABLET", readout: "ADAPTIVE SPLIT · 8PT GRID" },
  { code: "03", label: "390PX MOBILE", readout: "TOUCH ERGONOMICS · CLS 0.00" },
  { code: "04", label: "DOM EXPLODE", readout: "REACT 19 · 60 FPS HYDRATED" },
];

function FrontendWorkstationFigure() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const [activeIdx, setActiveIdx] = React.useState(2);

  const spreadTargetRef = React.useRef(1.0);
  const spreadSpringRef = React.useRef<Spring>({ at: 1.0, rate: 0 });
  const focusTargetRef = React.useRef(2);
  const focusSpringRef = React.useRef<Spring>({ at: 2, rate: 0 });
  const phaseRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ y: number; startSpread: number } | null>(null);
  const pauseUntilRef = React.useRef(0);

  const layer0Ref = React.useRef<SVGGElement>(null);
  const layer1Ref = React.useRef<SVGGElement>(null);
  const layer2Ref = React.useRef<SVGGElement>(null);

  const kick = useLoop((dt, calm) => {
    phaseRef.current += calm ? 0 : dt;
    spring(spreadSpringRef.current, spreadTargetRef.current, dt, 180, 18, calm);
    spring(focusSpringRef.current, focusTargetRef.current, dt, 190, 20, calm);

    const spread = spreadSpringRef.current.at;
    const focus = focusSpringRef.current.at;
    const t = phaseRef.current;

    const layers = [layer0Ref.current, layer1Ref.current, layer2Ref.current];
    layers.forEach((el, idx) => {
      if (!el) return;
      const breath = calm ? 0 : Math.sin(t * 2.2 + idx * 0.9) * 1.15;
      const isFocused = Math.max(0, 1 - Math.abs(focus - idx));
      const yShift = (idx + 1) * 2.6 * (spread - 1) + isFocused * 1.8;
      const zShift = breath + isFocused * 3.2 + (spread - 1) * (idx * 1.6);
      const dx = FE_AXIS_Y[0] * yShift + FE_AXIS_Z[0] * zShift;
      const dy = FE_AXIS_Y[1] * yShift + FE_AXIS_Z[1] * zShift;
      el.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
    });

    return inView || draggingRef.current;
  }, true);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, kick]);

  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingRef.current || Date.now() < pauseUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % FE_STATIONS.length;
        focusTargetRef.current = next === 3 ? 1 : next;
        spreadTargetRef.current = next === 3 ? 1.55 : 1.0;
        kick();
        return next;
      });
    }, 2800);
    return () => window.clearInterval(timer);
  }, [inView, kick]);

  const selectStation = (idx: number) => {
    pauseUntilRef.current = Date.now() + 6000;
    playMechanicalClick(620 + idx * 60);
    setActiveIdx(idx);
    focusTargetRef.current = idx === 3 ? 1 : idx;
    spreadTargetRef.current = idx === 3 ? 1.55 : 1.0;
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    pauseUntilRef.current = Date.now() + 8000;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    playMechanicalClick(540);
    grabRef.current = { y: e.clientY, startSpread: spreadTargetRef.current };
    kick();
  };

  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!grabRef.current) return;
    const dy = grabRef.current.y - e.clientY;
    spreadTargetRef.current = Math.max(0.45, Math.min(1.75, grabRef.current.startSpread + dy * 0.012));
    kick();
  };

  const onPointerEnd = () => {
    if (!grabRef.current) return;
    grabRef.current = null;
    draggingRef.current = false;
    playMechanicalClick(660);
    kick();
  };

  return (
    <div ref={containerRef} className="svc-anatomy iso light-machine" data-cursor="DRAG / CLICK">
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive 3D Widescreen Monitor Workstation and Floating Responsive UI Layers"
      >
        <Solid
          paths={feDeskBase}
          halo
          inner={
            <>
              <Line d={feDeskSeam} tone="faint" />
              <Line d={feDeskInset} tone="faint" />
            </>
          }
        >
          {feFeet.map((foot, idx) => (
            <Solid key={idx} paths={foot} tone="lo" />
          ))}
          {feScrews.map((sc, idx) => (
            <g key={idx}>
              <Line d={sc.well} tone="lo" />
              <Line d={sc.slot} tone="mid" />
            </g>
          ))}
          <Line d={feRulerTicks.minor} tone="faint" />
          <Line d={feRulerTicks.major} tone="lo" />

          {/* Stand & Studio Monitor */}
          <Solid paths={feStandBase} tone="mid" />
          <Solid paths={feStandNeck} tone="mid" />
          <Solid
            paths={feMonitorShell}
            tone="hi"
            halo
            inner={<Line d={feMonitorSeam} tone="faint" />}
          >
            <Line d={feScreenBezel} tone="mid" />
            <Line d={feScreenGrid} tone="faint" dashed />
            <Solid paths={feWebcam} tone="mid">
              <Line d={feWebcamLens} tone="green" />
            </Solid>
          </Solid>

          {/* Interactive Floating Responsive Viewport Layers */}
          <g
            className="rig-carriage-drag"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            {/* Layer 0: 1440px Desktop */}
            <g ref={layer0Ref} onClick={() => selectStation(0)}>
              <Solid paths={feLayerDesktop.slab} tone="hi" lit={activeIdx === 0 || activeIdx === 3} halo>
                <Line d={feLayerDesktop.frame} tone="mid" />
                <Line d={feLayerDesktop.wireframe} tone={activeIdx === 0 ? "green" : "lo"} />
                <FaceText transform={feLayerDesktop.labelTf} size={1.9} tone="hi">
                  01 · DESKTOP 1440PX
                </FaceText>
              </Solid>
            </g>

            {/* Layer 1: 768px Tablet */}
            <g ref={layer1Ref} onClick={() => selectStation(1)}>
              <Solid paths={feLayerTablet.slab} tone="hi" lit={activeIdx === 1 || activeIdx === 3} halo>
                <Line d={feLayerTablet.frame} tone="mid" />
                <Line d={feLayerTablet.wireframe} tone={activeIdx === 1 ? "green" : "lo"} />
                <FaceText transform={feLayerTablet.labelTf} size={1.85} tone="hi">
                  02 · TABLET 768PX
                </FaceText>
              </Solid>
            </g>

            {/* Layer 2: 390px Mobile */}
            <g ref={layer2Ref} onClick={() => selectStation(2)}>
              <Solid paths={feLayerMobile.slab} tone="hi" lit={activeIdx === 2 || activeIdx === 3} halo>
                <Line d={feLayerMobile.frame} tone="mid" />
                <Line d={feLayerMobile.wireframe} tone={activeIdx === 2 ? "green" : "lo"} />
                <FaceText transform={feLayerMobile.labelTf} size={1.8} tone="hi">
                  03 · MOBILE
                </FaceText>
              </Solid>
            </g>
          </g>

          {/* Front Mechanical Keyboard & Rotary Encoder */}
          <Solid paths={feKeyboardDeck} tone="mid">
            {feKeycaps.map((kc, idx) => (
              <Solid key={idx} paths={kc} tone="hi" />
            ))}
          </Solid>
          <Solid paths={feTrackpad} tone="mid">
            <Line d={feTrackpadInner} tone="faint" />
          </Solid>
          <Solid paths={feEncoderKnob} tone="hi" inner={<Line d={feEncoderKnurl} tone="lo" />} />
        </Solid>
      </IsoFigure>

      <StationBar
        stations={FE_STATIONS}
        activeIdx={activeIdx}
        onSelect={selectStation}
        darkMachine={false}
      />
    </div>
  );
}

/* ============================================================================
   2. BACKEND & DATABASE ARCHITECTURE
      Vertical Server Blade Rack Tower (Pull-Out Blades) + 3 DB Platter Vaults
   ============================================================================ */
const BE_BASE: Plan = { x: 0, y: 0, w: 120, d: 72, r: 7 };
const BE_PROJ: Projection = fitProjection(
  boxCorners({ x: -2, y: -2, w: 124, d: 78, r: 0 }, -3, 44),
  WIDTH,
  HEIGHT,
  { pad: 10, headroom: 4 }
);
const BE_AXIS_Y = axisVector(BE_PROJ, [0, 1, 0]);

const beBaseSolid = slabOf(BE_BASE, 0, 6.0, BE_PROJ, 8, 0.75);
const beBaseSeam = sideSeam(BE_BASE, 2.0, BE_PROJ);
const beBaseInset = planOutline(insetPlan(BE_BASE, 2.8), 6.0, BE_PROJ);
const beFeet = corners(BE_BASE, 8).map(([cx, cy]) =>
  cylinder(cx, cy, 4.3, -2.4, 2.4, BE_PROJ, 20)
);
const beVentDots = dotGrid(14, 58, 22, 2, 4.0, 6.0, BE_PROJ);

// Left Zone: Vertical Server Rack Cabinet
const beRackPlinth = slabOf({ x: 10, y: 10, w: 46, d: 38, r: 3.2 }, 6.0, 3.0, BE_PROJ, 6, 0.4);
const beRackBackWall = slabOf({ x: 10, y: 10, w: 46, d: 5.5, r: 2.0 }, 9.0, 29.0, BE_PROJ, 4);
const beRackLeftPost = slabOf({ x: 10, y: 10, w: 4.5, d: 38, r: 1.5 }, 9.0, 29.0, BE_PROJ, 4);
const beRackRightPost = slabOf({ x: 51.5, y: 10, w: 4.5, d: 38, r: 1.5 }, 9.0, 29.0, BE_PROJ, 4);
const beRackCap = slabOf({ x: 9.5, y: 9.5, w: 47, d: 39, r: 3.4 }, 38.0, 3.2, BE_PROJ, 6, 0.5);
const beFanRing = ring(33, 29, 10.5, 41.2, BE_PROJ, 28);
const beFanHub = cylinder(33, 29, 3.8, 41.2, 1.4, BE_PROJ, 18);
const beFanTicks = radialTicks(33, 29, 9.8, 12, 3, 41.2, [3.2, 5.2], BE_PROJ);

// 3 Pull-Out Server Blades stacked vertically inside the rack
const BE_BLADES = [
  { idx: 0, z: 10.2, label: "01 · REST API & NIK", ledZ: 13.5 },
  { idx: 1, z: 19.2, label: "02 · ELOQUENT ORM", ledZ: 22.5 },
  { idx: 2, z: 28.2, label: "03 · RBAC & RLS GATE", ledZ: 31.5 },
].map((b) => {
  const trayPlan: Plan = { x: 15.5, y: 15, w: 35, d: 32, r: 2.0 };
  const handlePlan: Plan = { x: 18.5, y: 47, w: 29, d: 3.2, r: 1.2 };
  return {
    ...b,
    tray: slabOf(trayPlan, b.z, 6.6, BE_PROJ, 6, 0.4),
    inner: planOutline(insetPlan(trayPlan, 2.2), b.z + 6.6, BE_PROJ),
    traces: joinPaths([
      lineOnTop([19, 20], [46, 20], b.z + 6.6, BE_PROJ),
      lineOnTop([19, 25], [42, 25], b.z + 6.6, BE_PROJ),
      lineOnTop([19, 30], [46, 30], b.z + 6.6, BE_PROJ),
    ]),
    handle: slabOf(handlePlan, b.z + 1.2, 4.2, BE_PROJ, 4),
    leds: [
      iso([20, 46.8, b.ledZ], BE_PROJ),
      iso([23.5, 46.8, b.ledZ], BE_PROJ),
      iso([27, 46.8, b.ledZ], BE_PROJ),
    ] as Flat[],
    labelTf: topMatrix([18.5, 40.5], b.z + 6.6, BE_PROJ),
  };
});

// Right Zone: 3 Cylindrical Relational & NoSQL Database Platter Vaults
const BE_DRUMS = [
  { cx: 74, cy: 20, r: 11.5, h: 22.0, name: "PG · SUPABASE" },
  { cx: 100, cy: 22, r: 11.0, h: 18.5, name: "MYSQL · GOV" },
  { cx: 86, cy: 43, r: 12.0, h: 15.5, name: "MONGODB · DOC" },
].map((d) => {
  const topZ = 6.0 + d.h;
  return {
    ...d,
    topZ,
    body: cylinder(d.cx, d.cy, d.r, 6.0, d.h, BE_PROJ, 32, 0.55),
    knurlPath: knurl(d.cx, d.cy, d.r, 6.0, topZ, 22, BE_PROJ, 1.0),
    ring1: sideSeam({ x: d.cx - d.r, y: d.cy - d.r, w: d.r * 2, d: d.r * 2, r: d.r }, 6.0 + d.h * 0.35, BE_PROJ, 12),
    ring2: sideSeam({ x: d.cx - d.r, y: d.cy - d.r, w: d.r * 2, d: d.r * 2, r: d.r }, 6.0 + d.h * 0.7, BE_PROJ, 12),
    spindle: cylinder(d.cx, d.cy, 3.2, topZ, 2.2, BE_PROJ, 18),
    ticks: radialTicks(d.cx, d.cy, d.r - 1.6, 16, 4, topZ, [1.5, 2.8], BE_PROJ),
    wireFrom: iso([56, 28, 8.2], BE_PROJ),
    wireVia: iso([d.cx - d.r - 2, d.cy, 8.2], BE_PROJ),
    wireTo: iso([d.cx - d.r + 0.5, d.cy, 8.2], BE_PROJ),
  };
});

const BE_STATIONS: StationSpec[] = [
  { code: "01", label: "REST API & NIK", readout: "CITIZENS_NIK · 8.4 MS QUERY" },
  { code: "02", label: "ELOQUENT ORM", readout: "KK_CENSUS JOIN · 11.2 MS" },
  { code: "03", label: "RBAC & RLS VAULT", readout: "3-ROLE AUTH · 100% PG RLS" },
];

function BackendVaultFigure() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const bladeSpringsRef = React.useRef<[Spring, Spring, Spring]>([
    { at: 12, rate: 0 },
    { at: 0, rate: 0 },
    { at: 0, rate: 0 },
  ]);
  const bladeTargetsRef = React.useRef<[number, number, number]>([12, 0, 0]);
  const phaseRef = React.useRef(0);
  const draggingIdxRef = React.useRef<number | null>(null);
  const grabRef = React.useRef<{ clientX: number; clientY: number; startPull: number } | null>(null);
  const pauseUntilRef = React.useRef(0);

  const bladeRefs = [
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
  ];
  const armRefs = [
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
  ];

  const kick = useLoop((dt, calm) => {
    phaseRef.current += calm ? 0 : dt;
    const t = phaseRef.current;

    for (let i = 0; i < 3; i++) {
      const sp = bladeSpringsRef.current[i]!;
      const target = bladeTargetsRef.current[i]! + (calm ? 0 : Math.sin(t * 2.4 + i) * 0.9);
      spring(sp, target, dt, 190, 19, calm);
      const pull = sp.at;
      const el = bladeRefs[i]?.current;
      if (el) {
        el.setAttribute(
          "transform",
          `translate(${(BE_AXIS_Y[0] * pull).toFixed(2)} ${(BE_AXIS_Y[1] * pull).toFixed(2)})`
        );
      }

      // Update rotating read-head arm on each DB cylinder
      const drum = BE_DRUMS[i]!;
      const armPath = armRefs[i]?.current?.querySelector("path");
      if (armPath) {
        const angle = -0.6 + (pull / 14) * 1.4 + (calm ? 0 : Math.sin(t * 3.1 + i * 1.2) * 0.35);
        const d = lineOnTop(
          [drum.cx, drum.cy],
          [
            drum.cx + Math.cos(angle) * (drum.r - 2.2),
            drum.cy + Math.sin(angle) * (drum.r - 2.2),
          ],
          drum.topZ + 0.5,
          BE_PROJ
        );
        armPath.setAttribute("d", d);
      }
    }

    return inView || draggingIdxRef.current !== null;
  }, true);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, kick]);

  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingIdxRef.current !== null || Date.now() < pauseUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % BE_STATIONS.length;
        bladeTargetsRef.current = [
          next === 0 ? 12.5 : 1.0,
          next === 1 ? 12.5 : 1.0,
          next === 2 ? 12.5 : 1.0,
        ];
        kick();
        return next;
      });
    }, 2700);
    return () => window.clearInterval(timer);
  }, [inView, kick]);

  const selectStation = (idx: number) => {
    pauseUntilRef.current = Date.now() + 6000;
    playMechanicalClick(600 + idx * 70);
    setActiveIdx(idx);
    bladeTargetsRef.current = [
      idx === 0 ? 12.5 : 1.0,
      idx === 1 ? 12.5 : 1.0,
      idx === 2 ? 12.5 : 1.0,
    ];
    kick();
  };

  const onBladePointerDown = (idx: number, e: React.PointerEvent<SVGGElement>) => {
    pauseUntilRef.current = Date.now() + 8000;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingIdxRef.current = idx;
    setActiveIdx(idx);
    playMechanicalClick(540);
    grabRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPull: bladeTargetsRef.current[idx] ?? 0,
    };
    kick();
  };

  const onBladePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    const idx = draggingIdxRef.current;
    const grab = grabRef.current;
    const svg = e.currentTarget.ownerSVGElement;
    if (idx === null || !grab || !svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - grab.clientX) * (WIDTH / rect.width);
    const dy = (e.clientY - grab.clientY) * (HEIGHT / rect.height);
    const deltaAlongY =
      (dx * BE_AXIS_Y[0] + dy * BE_AXIS_Y[1]) /
      (BE_AXIS_Y[0] * BE_AXIS_Y[0] + BE_AXIS_Y[1] * BE_AXIS_Y[1]);
    const nextPull = Math.max(0, Math.min(14.5, grab.startPull + deltaAlongY));
    bladeTargetsRef.current[idx] = nextPull;
    kick();
  };

  const onBladePointerEnd = () => {
    const idx = draggingIdxRef.current;
    if (idx === null) return;
    draggingIdxRef.current = null;
    grabRef.current = null;
    playMechanicalClick(680);
    kick();
  };

  return (
    <div ref={containerRef} className="svc-anatomy iso light-machine" data-cursor="DRAG BLADE / CLICK">
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive 3D Server Blade Rack Cabinet and Relational Database Platter Vault"
      >
        <Solid
          paths={beBaseSolid}
          halo
          inner={
            <>
              <Line d={beBaseSeam} tone="faint" />
              <Line d={beBaseInset} tone="faint" />
            </>
          }
        >
          {beFeet.map((foot, idx) => (
            <Solid key={idx} paths={foot} tone="lo" />
          ))}
          <Dots points={beVentDots} size={0.48} tone="lo" />

          {/* Data Conduits from Rack to DB Vaults */}
          {BE_DRUMS.map((d, idx) => (
            <Wire
              key={idx}
              from={d.wireFrom}
              via={[d.wireVia]}
              to={d.wireTo}
              tone={activeIdx === idx ? "green" : "lo"}
              flow={activeIdx === idx}
              size={1.0}
            />
          ))}

          {/* Left: Server Blade Rack Cabinet */}
          <Solid paths={beRackPlinth} tone="mid" />
          <Solid paths={beRackBackWall} tone="mid" />
          <Solid paths={beRackLeftPost} tone="mid" />

          {/* 3 Pull-Out Server Blades */}
          {BE_BLADES.map((blade, idx) => (
            <g
              key={blade.idx}
              ref={bladeRefs[idx]}
              className="rig-carriage-drag"
              onPointerDown={(e) => onBladePointerDown(idx, e)}
              onPointerMove={onBladePointerMove}
              onPointerUp={onBladePointerEnd}
              onPointerCancel={onBladePointerEnd}
            >
              <Solid paths={blade.tray} tone="hi" lit={activeIdx === idx} halo>
                <Line d={blade.inner} tone="lo" />
                <Line d={blade.traces} tone={activeIdx === idx ? "green" : "faint"} />
                <FaceText transform={blade.labelTf} size={1.85} tone="hi">
                  {blade.label}
                </FaceText>
                <Solid paths={blade.handle} tone="hi" lit={activeIdx === idx}>
                  <Dots points={blade.leds} size={0.85} tone="hi" />
                </Solid>
              </Solid>
            </g>
          ))}

          <Solid paths={beRackRightPost} tone="mid" />
          <Solid paths={beRackCap} tone="hi" halo>
            <Line d={beFanRing} tone="mid" />
            <Line d={beFanTicks.minor} tone="lo" />
            <Line d={beFanTicks.major} tone="mid" />
            <Solid paths={beFanHub} tone="hi" />
          </Solid>

          {/* Right: 3 Cylindrical Database Platter Drums */}
          {BE_DRUMS.map((drum, idx) => (
            <Solid
              key={drum.name}
              paths={drum.body}
              tone="hi"
              lit={activeIdx === idx}
              halo
              inner={
                <>
                  <Line d={drum.knurlPath} tone="faint" />
                  <Line d={drum.ring1} tone="lo" />
                  <Line d={drum.ring2} tone="lo" />
                </>
              }
            >
              <Line d={drum.ticks.minor} tone="lo" />
              <Line d={drum.ticks.major} tone="mid" />
              <g ref={armRefs[idx]}>
                <Line
                  d={lineOnTop([drum.cx, drum.cy], [drum.cx + drum.r - 2.2, drum.cy], drum.topZ + 0.5, BE_PROJ)}
                  tone="green"
                />
              </g>
              <Solid paths={drum.spindle} tone="mid" />
            </Solid>
          ))}
        </Solid>
      </IsoFigure>

      <StationBar
        stations={BE_STATIONS}
        activeIdx={activeIdx}
        onSelect={selectStation}
        darkMachine={false}
      />
    </div>
  );
}

/* ============================================================================
   3. MOBILE APP DEVELOPMENT
      Exploded-View 4-Layer Isometric Smartphone (Handphone Berlapis)
      Drag vertically to Explode/Compress layers; idle breathing & layer scan
   ============================================================================ */
const MOB_PHONE_PLAN: Plan = { x: 18, y: 12, w: 84, d: 46, r: 8.5 };
const MOB_PROJ: Projection = fitProjection(
  boxCorners({ x: 6, y: 4, w: 108, d: 62, r: 0 }, -2, 66),
  WIDTH,
  HEIGHT,
  { pad: 10, headroom: 6 }
);
const MOB_AXIS_Z = axisVector(MOB_PROJ, [0, 0, 1]);

// Precision Dock Calibration Pad Underneath
const mobDockPad = slabOf({ x: 10, y: 6, w: 100, d: 58, r: 9 }, 0, 3.2, MOB_PROJ, 8, 0.5);
const mobDockInset = planOutline(insetPlan({ x: 10, y: 6, w: 100, d: 58, r: 9 }, 2.6), 3.2, MOB_PROJ);
const mobDockTicks = topTicks(20, 100, 2.5, 4, 60.5, 3.2, [1.4, 2.6], MOB_PROJ);
const mobDockScrews = corners({ x: 10, y: 6, w: 100, d: 58, r: 9 }, 6.5).map(([cx, cy]) =>
  ring(cx, cy, 1.6, 3.2, MOB_PROJ, 16)
);

// Layer 1 (Base Z = 5.5): Machined Aluminum Unibody Chassis & Triple Camera Module
const MOB_L1_Z = 5.5;
const mobL1Chassis = slabOf(MOB_PHONE_PLAN, MOB_L1_Z, 4.6, MOB_PROJ, 10, 0.7);
const mobL1Seam = sideSeam(MOB_PHONE_PLAN, MOB_L1_Z + 2.2, MOB_PROJ, 10);
const mobL1Cavity = planOutline(insetPlan(MOB_PHONE_PLAN, 2.6), MOB_L1_Z + 4.6, MOB_PROJ, 8);
const mobCamIsland = slabOf({ x: 22, y: 15.5, w: 22, d: 20, r: 3.5 }, MOB_L1_Z + 4.6, 1.8, MOB_PROJ, 6, 0.3);
const mobCamLenses = [
  [28.5, 21.5],
  [28.5, 30.0],
  [37.5, 25.5],
].map(([cx, cy]) => ({
  barrel: cylinder(cx!, cy!, 3.4, MOB_L1_Z + 6.4, 1.6, MOB_PROJ, 20),
  glass: ring(cx!, cy!, 1.8, MOB_L1_Z + 8.0, MOB_PROJ, 16),
}));
const mobSideButtons = [
  slabOf({ x: 34, y: 58.0, w: 9, d: 1.5, r: 0.6 }, MOB_L1_Z + 1.2, 2.0, MOB_PROJ, 4),
  slabOf({ x: 46, y: 58.0, w: 9, d: 1.5, r: 0.6 }, MOB_L1_Z + 1.2, 2.0, MOB_PROJ, 4),
  slabOf({ x: 102.0, y: 31, w: 1.6, d: 8, r: 0.6 }, MOB_L1_Z + 1.2, 2.0, MOB_PROJ, 4),
];

// Layer 2 (Base Z = 18.0): Logic Board PCB, Dart AOT SoC Chip & Lithium Battery Pack
const MOB_L2_Z = 18.0;
const MOB_PCB_PLAN = insetPlan(MOB_PHONE_PLAN, 3.2);
const mobL2Board = slabOf(MOB_PCB_PLAN, MOB_L2_Z, 2.4, MOB_PROJ, 8, 0.35);
const mobBatterySlab = slabOf({ x: 52, y: 17.5, w: 43, d: 35, r: 2.8 }, MOB_L2_Z + 2.4, 2.2, MOB_PROJ, 6, 0.35);
const mobBatteryInner = planOutline(insetPlan({ x: 52, y: 17.5, w: 43, d: 35, r: 2.8 }, 2.0), MOB_L2_Z + 4.6, MOB_PROJ);
const mobBatteryLabelTf = topMatrix([57, 36], MOB_L2_Z + 4.6, MOB_PROJ);
const mobSocDie = slabOf({ x: 26, y: 26, w: 18, d: 16, r: 1.8 }, MOB_L2_Z + 2.4, 2.4, MOB_PROJ, 6, 0.35);
const mobSocPins = joinPaths([
  topTicks(28, 42, 2.2, 2, 24.2, MOB_L2_Z + 2.4, [1.5, 1.8], MOB_PROJ, "x").minor,
  topTicks(28, 42, 2.2, 2, 42.2, MOB_L2_Z + 2.4, [1.5, 1.8], MOB_PROJ, "x").minor,
]);
const mobSocLabelTf = topMatrix([28.5, 35.5], MOB_L2_Z + 4.8, MOB_PROJ);
const mobImuSensor = cylinder(35, 19.5, 3.2, MOB_L2_Z + 2.4, 2.0, MOB_PROJ, 18);

// Layer 3 (Base Z = 31.0): 60fps OLED Display Glass & Impeller Framebuffer
const MOB_L3_Z = 31.0;
const MOB_GLASS_PLAN = insetPlan(MOB_PHONE_PLAN, 1.0);
const mobL3Glass = slabOf(MOB_GLASS_PLAN, MOB_L3_Z, 2.0, MOB_PROJ, 10, 0.45);
const mobL3ScreenViewport = planOutline(insetPlan(MOB_GLASS_PLAN, 2.4), MOB_L3_Z + 2.0, MOB_PROJ, 8);
const mobDynamicIsland = planOutline({ x: 22.5, y: 29.5, w: 3.6, d: 11, r: 1.8 }, MOB_L3_Z + 2.0, MOB_PROJ, 8);
const mobScreenGrid = joinPaths([
  lineOnTop([30, 17], [30, 53], MOB_L3_Z + 2.0, MOB_PROJ),
  lineOnTop([30, 35], [94, 35], MOB_L3_Z + 2.0, MOB_PROJ),
  lineOnTop([62, 17], [62, 53], MOB_L3_Z + 2.0, MOB_PROJ),
  lineOnTop([94, 28], [94, 42], MOB_L3_Z + 2.0, MOB_PROJ),
]);
const mobL3LabelTf = topMatrix([33, 50], MOB_L3_Z + 2.0, MOB_PROJ);

// Layer 4 (Base Z = 44.0): Floating Cross-Platform UI Widgets, Camera Viewfinder & TTS HUD
const MOB_L4_Z = 44.0;
const mobUiHeroCard = slabOf({ x: 28, y: 17.5, w: 34, d: 34, r: 3.2 }, MOB_L4_Z, 2.2, MOB_PROJ, 6, 0.35);
const mobUiHeroReticle = ring(45, 34.5, 7.5, MOB_L4_Z + 2.2, MOB_PROJ, 24);
const mobUiHeroCross = joinPaths([
  lineOnTop([41, 34.5], [49, 34.5], MOB_L4_Z + 2.2, MOB_PROJ),
  lineOnTop([45, 30.5], [45, 38.5], MOB_L4_Z + 2.2, MOB_PROJ),
]);
const mobUiTtsCard = slabOf({ x: 66, y: 17.5, w: 28, d: 15.5, r: 2.6 }, MOB_L4_Z, 2.2, MOB_PROJ, 6, 0.35);
const mobUiTtsWave = joinPaths(
  Array.from({ length: 7 }, (_, i) => {
    const x = 70 + i * 3.2;
    const half = i % 2 === 0 ? 4.2 : 2.2;
    return lineOnTop([x, 25.2 - half], [x, 25.2 + half], MOB_L4_Z + 2.2, MOB_PROJ);
  })
);
const mobUiTelemetryCard = slabOf({ x: 66, y: 36, w: 28, d: 15.5, r: 2.6 }, MOB_L4_Z, 2.2, MOB_PROJ, 6, 0.35);
const mobUiTelemetryLabelTf = topMatrix([69, 45.5], MOB_L4_Z + 2.2, MOB_PROJ);

const MOB_STATIONS: StationSpec[] = [
  { code: "01", label: "UNIBODY & CAM", readout: "TRIPLE OPTICS · 1080P STREAM" },
  { code: "02", label: "DART AOT & PCB", readout: "ARM64 NATIVE · BLE TELEMETRY" },
  { code: "03", label: "60FPS OLED GLASS", readout: "FLUTTER IMPELLER · 14.2 MS" },
  { code: "04", label: "FLOATING UI HUD", readout: "CROSS-PLATFORM · TTS READY" },
];

function MobileLayeredPhoneFigure() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const [activeIdx, setActiveIdx] = React.useState(3);

  const explodeTargetRef = React.useRef(1.0);
  const explodeSpringRef = React.useRef<Spring>({ at: 1.0, rate: 0 });
  const focusTargetRef = React.useRef(3);
  const focusSpringRef = React.useRef<Spring>({ at: 3, rate: 0 });
  const phaseRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ y: number; startExplode: number } | null>(null);
  const pauseUntilRef = React.useRef(0);

  const layerRefs = [
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
    React.useRef<SVGGElement>(null),
  ];
  const guidePathRef = React.useRef<SVGGElement>(null);

  const kick = useLoop((dt, calm) => {
    phaseRef.current += calm ? 0 : dt;
    spring(explodeSpringRef.current, explodeTargetRef.current, dt, 175, 18, calm);
    spring(focusSpringRef.current, focusTargetRef.current, dt, 195, 20, calm);

    const t = phaseRef.current;
    const explode = explodeSpringRef.current.at + (calm ? 0 : Math.sin(t * 1.9) * 0.08);
    const focus = focusSpringRef.current.at;

    const zOffsets: number[] = [];
    for (let i = 0; i < 4; i++) {
      const wave = calm ? 0 : Math.sin(t * 2.3 + i * 0.7) * 0.85;
      const isFocused = Math.max(0, 1 - Math.abs(focus - i));
      // Layer 0 stays near base, layers 1..3 expand progressively upward with explode factor
      const baseGap = (explode - 1.0) * i * 5.2;
      const focusLift = isFocused * 2.4;
      const dz = baseGap + focusLift + wave;
      zOffsets.push(dz);

      const el = layerRefs[i]?.current;
      if (el) {
        el.setAttribute(
          "transform",
          `translate(${(MOB_AXIS_Z[0] * dz).toFixed(2)} ${(MOB_AXIS_Z[1] * dz).toFixed(2)})`
        );
      }
    }

    // Update 4 corner vertical exploded alignment guide lines
    const guideEl = guidePathRef.current?.querySelector("path");
    if (guideEl) {
      const cPts = corners(MOB_PHONE_PLAN, 6.0);
      const topZ = MOB_L4_Z + 2.2 + (zOffsets[3] ?? 0);
      const botZ = MOB_L1_Z + (zOffsets[0] ?? 0);
      const d = joinPaths(cPts.map((pt) => rise(pt, botZ, topZ, MOB_PROJ)));
      guideEl.setAttribute("d", d);
    }

    return inView || draggingRef.current;
  }, true);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, kick]);

  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingRef.current || Date.now() < pauseUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % MOB_STATIONS.length;
        focusTargetRef.current = next;
        explodeTargetRef.current = next === 0 ? 0.65 : next === 3 ? 1.25 : 1.05;
        kick();
        return next;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [inView, kick]);

  const selectStation = (idx: number) => {
    pauseUntilRef.current = Date.now() + 6000;
    playMechanicalClick(620 + idx * 65);
    setActiveIdx(idx);
    focusTargetRef.current = idx;
    explodeTargetRef.current = idx === 0 ? 0.7 : idx === 3 ? 1.3 : 1.08;
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    pauseUntilRef.current = Date.now() + 8000;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    playMechanicalClick(530);
    grabRef.current = { y: e.clientY, startExplode: explodeTargetRef.current };
    kick();
  };

  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!grabRef.current) return;
    const dy = grabRef.current.y - e.clientY;
    explodeTargetRef.current = Math.max(0.2, Math.min(1.55, grabRef.current.startExplode + dy * 0.011));
    kick();
  };

  const onPointerEnd = () => {
    if (!grabRef.current) return;
    grabRef.current = null;
    draggingRef.current = false;
    playMechanicalClick(690);
    kick();
  };

  return (
    <div ref={containerRef} className="svc-anatomy iso dark-machine" data-cursor="DRAG EXPLODE / CLICK">
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive 4-Layer Exploded Isometric Smartphone Architecture"
      >
        {/* Bottom Dock Calibration Plate */}
        <Solid paths={mobDockPad} tone="lo" halo inner={<Line d={mobDockInset} tone="faint" />}>
          <Line d={mobDockTicks.minor} tone="faint" />
          <Line d={mobDockTicks.major} tone="lo" />
          {mobDockScrews.map((sc, idx) => (
            <Line key={idx} d={sc} tone="lo" />
          ))}
        </Solid>

        {/* 4 Corner Exploded Alignment Guide Lines */}
        <g ref={guidePathRef} className="rig-no-hit">
          <Line
            d={joinPaths(corners(MOB_PHONE_PLAN, 6.0).map((pt) => rise(pt, MOB_L1_Z, MOB_L4_Z + 2.2, MOB_PROJ)))}
            tone="lo"
            dashed
          />
        </g>

        {/* Interactive 4-Layer Smartphone Stack */}
        <g
          className="rig-carriage-drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {/* LAYER 1: Machined Unibody Chassis & Triple Camera Bump */}
          <g ref={layerRefs[0]} onClick={() => selectStation(0)}>
            <Solid
              paths={mobL1Chassis}
              tone="hi"
              lit={activeIdx === 0}
              halo
              inner={
                <>
                  <Line d={mobL1Seam} tone="lo" />
                  <Line d={mobL1Cavity} tone="mid" />
                </>
              }
            >
              {mobSideButtons.map((btn, idx) => (
                <Solid key={idx} paths={btn} tone="mid" />
              ))}
              <Solid paths={mobCamIsland} tone="mid">
                {mobCamLenses.map((cam, idx) => (
                  <Solid key={idx} paths={cam.barrel} tone="hi">
                    <Line d={cam.glass} tone="green" />
                  </Solid>
                ))}
              </Solid>
            </Solid>
          </g>

          {/* LAYER 2: Mainboard PCB, Dart AOT SoC & Lithium Battery */}
          <g ref={layerRefs[1]} onClick={() => selectStation(1)}>
            <Solid paths={mobL2Board} tone="mid" lit={activeIdx === 1} halo>
              <Solid paths={mobBatterySlab} tone="hi" inner={<Line d={mobBatteryInner} tone="lo" />}>
                <FaceText transform={mobBatteryLabelTf} size={1.85} tone="hi">
                  LI-ION · BLE
                </FaceText>
              </Solid>
              <Line d={mobSocPins} tone="green" />
              <Solid paths={mobSocDie} tone="hi" lit={activeIdx === 1}>
                <FaceText transform={mobSocLabelTf} size={1.75} tone="hi">
                  DART AOT
                </FaceText>
              </Solid>
              <Solid paths={mobImuSensor} tone="mid" />
            </Solid>
          </g>

          {/* LAYER 3: 60fps OLED Display Glass Panel */}
          <g ref={layerRefs[2]} onClick={() => selectStation(2)}>
            <Solid paths={mobL3Glass} tone="hi" lit={activeIdx === 2} halo>
              <Line d={mobL3ScreenViewport} tone="mid" />
              <Line d={mobDynamicIsland} tone="hi" />
              <Line d={mobScreenGrid} tone={activeIdx === 2 ? "green" : "faint"} dashed />
              <FaceText transform={mobL3LabelTf} size={1.9} tone="hi">
                FLUTTER 60FPS OLED
              </FaceText>
            </Solid>
          </g>

          {/* LAYER 4: Floating Cross-Platform UI Widgets & Audio/Camera HUD */}
          <g ref={layerRefs[3]} onClick={() => selectStation(3)}>
            <Solid paths={mobUiHeroCard} tone="hi" lit={activeIdx === 3} halo>
              <Line d={mobUiHeroReticle} tone="green" />
              <Line d={mobUiHeroCross} tone="hi" />
            </Solid>
            <Solid paths={mobUiTtsCard} tone="hi" lit={activeIdx === 3} halo>
              <Line d={mobUiTtsWave} tone="green" />
            </Solid>
            <Solid paths={mobUiTelemetryCard} tone="hi" lit={activeIdx === 3} halo>
              <FaceText transform={mobUiTelemetryLabelTf} size={1.85} tone="hi">
                UI WIDGETS
              </FaceText>
            </Solid>
          </g>
        </g>
      </IsoFigure>

      <StationBar
        stations={MOB_STATIONS}
        activeIdx={activeIdx}
        onSelect={selectStation}
        darkMachine={true}
      />
    </div>
  );
}

/* ============================================================================
   4. MACHINE LEARNING, DEEP LEARNING & COMPUTER VISION
      21-Point Articulated Robotic Hand Rig + SAR Banknote Stage + Overhead Gimbal
   ============================================================================ */
const AI_BASE: Plan = { x: 0, y: 0, w: 120, d: 72, r: 7 };
const AI_PROJ: Projection = fitProjection(
  boxCorners({ x: -2, y: -2, w: 124, d: 76, r: 0 }, -3, 45),
  WIDTH,
  HEIGHT,
  { pad: 10, headroom: 4 }
);
const AI_AXIS_X = axisVector(AI_PROJ, [1, 0, 0]);
const AI_AXIS_Z = axisVector(AI_PROJ, [0, 0, 1]);

const aiBaseSolid = slabOf(AI_BASE, 0, 5.8, AI_PROJ, 8, 0.7);
const aiBaseSeam = sideSeam(AI_BASE, 2.0, AI_PROJ);
const aiBaseInset = planOutline(insetPlan(AI_BASE, 2.8), 5.8, AI_PROJ);
const aiFeet = corners(AI_BASE, 8).map(([cx, cy]) =>
  cylinder(cx, cy, 4.2, -2.4, 2.4, AI_PROJ, 20)
);
const aiFrontTicks = topTicks(14, 106, 2, 5, 67.2, 5.8, [1.5, 3.0], AI_PROJ);

// Overhead Optical Scanner Gantry Arch Spanning X = 14 .. 106
const aiLeftPillar = slabOf({ x: 10, y: 8, w: 6.5, d: 8.5, r: 1.5 }, 5.8, 30.0, AI_PROJ, 4);
const aiRightPillar = slabOf({ x: 103.5, y: 8, w: 6.5, d: 8.5, r: 1.5 }, 5.8, 30.0, AI_PROJ, 4);
const aiGantryBeam = slabOf({ x: 8, y: 6.5, w: 104, d: 11.5, r: 2.2 }, 35.8, 4.2, AI_PROJ, 6, 0.45);
const aiGantryTicks = topTicks(16, 104, 2.5, 4, 15.2, 40.0, [1.2, 2.4], AI_PROJ);

// Sliding Camera Gimbal Pod (built at x = 0, translated to camX)
const aiCamCarriage = slabOf({ x: -9, y: 5.5, w: 18, d: 13.5, r: 2.2 }, 34.5, 6.8, AI_PROJ, 6, 0.4);
const aiCamTurret = cylinder(0, 12.2, 4.6, 41.3, 2.6, AI_PROJ, 22);
const aiCamLensRing = ring(0, 12.2, 2.5, 43.9, AI_PROJ, 18);

// Station 1 (Left): SAR 100 Banknote Optical Stage
const aiSarPlaten = slabOf({ x: 14, y: 26, w: 30, d: 28, r: 2.8 }, 5.8, 3.4, AI_PROJ, 6, 0.4);
const aiSarNote = slabOf({ x: 17, y: 29, w: 24, d: 16, r: 1.5 }, 9.2, 1.2, AI_PROJ, 4);
const aiSarSeal = ring(34, 37, 3.6, 10.4, AI_PROJ, 20);
const aiSarLabelTf = topMatrix([19, 46.5], 9.2, AI_PROJ);

// Station 2 (Center): 21-Joint Articulated Robotic Hand Rig
const aiHandPedestal = slabOf({ x: 46, y: 18, w: 38, d: 42, r: 3.6 }, 5.8, 3.2, AI_PROJ, 6, 0.4);
const aiWristCuff = slabOf({ x: 59, y: 49, w: 12, d: 7.5, r: 2.0 }, 9.0, 3.6, AI_PROJ, 5, 0.35);
const aiPalmChassis = slabOf({ x: 55, y: 37, w: 20, d: 13.5, r: 2.8 }, 9.0, 4.2, AI_PROJ, 6, 0.4);

// 5 Articulated Mechanical Fingers with 3D Phalanx Bars + 21 MediaPipe Landmark Nodes
const aiProximalPhalanges = [
  slabOf({ x: 48.5, y: 38.5, w: 6.2, d: 4.2, r: 1.1 }, 9.6, 3.2, AI_PROJ, 4, 0.3), // Thumb proximal
  slabOf({ x: 55.2, y: 29.0, w: 3.4, d: 7.8, r: 1.0 }, 9.6, 3.2, AI_PROJ, 4, 0.3), // Index proximal
  slabOf({ x: 60.3, y: 27.5, w: 3.6, d: 9.2, r: 1.0 }, 9.6, 3.4, AI_PROJ, 4, 0.3), // Middle proximal
  slabOf({ x: 65.6, y: 28.5, w: 3.4, d: 8.2, r: 1.0 }, 9.6, 3.2, AI_PROJ, 4, 0.3), // Ring proximal
  slabOf({ x: 70.6, y: 30.8, w: 3.2, d: 6.2, r: 1.0 }, 9.6, 3.0, AI_PROJ, 4, 0.3), // Pinky proximal
];
const aiDistalPhalanges = [
  slabOf({ x: 46.5, y: 32.0, w: 4.2, d: 5.8, r: 1.1 }, 10.4, 3.0, AI_PROJ, 4, 0.3), // Thumb distal
  slabOf({ x: 55.2, y: 21.5, w: 3.2, d: 6.8, r: 1.0 }, 10.4, 3.0, AI_PROJ, 4, 0.3), // Index distal
  slabOf({ x: 60.4, y: 19.5, w: 3.4, d: 7.4, r: 1.0 }, 10.4, 3.2, AI_PROJ, 4, 0.3), // Middle distal
  slabOf({ x: 65.6, y: 21.0, w: 3.2, d: 6.8, r: 1.0 }, 10.4, 3.0, AI_PROJ, 4, 0.3), // Ring distal
  slabOf({ x: 70.6, y: 24.2, w: 3.0, d: 5.8, r: 1.0 }, 10.4, 2.8, AI_PROJ, 4, 0.3), // Pinky distal
];

const AI_WRIST_PT: [number, number] = [65, 52.5];
const AI_FINGER_CHAINS: [number, number][][] = [
  [[58, 46], [53, 41.5], [49.2, 36.5], [48.2, 32.8]],       // Thumb (4 pts)
  [[57, 38.5], [56.9, 30.2], [56.8, 25.4], [56.8, 22.0]],   // Index (4 pts)
  [[62.1, 38.0], [62.1, 28.8], [62.1, 23.8], [62.1, 20.2]], // Middle (4 pts)
  [[67.3, 38.5], [67.3, 29.8], [67.2, 24.8], [67.2, 21.6]], // Ring (4 pts)
  [[72.2, 39.5], [72.2, 32.0], [72.1, 27.6], [72.1, 24.8]], // Pinky (4 pts)
];
const aiPalmSkeleton = joinPaths([
  ...AI_FINGER_CHAINS.map((chain) => lineOnTop(AI_WRIST_PT, chain[0]!, 13.5, AI_PROJ)),
  ...AI_FINGER_CHAINS.map((chain) => lineOnTop(chain[0]!, chain[1]!, 13.5, AI_PROJ)),
  lineOnTop(AI_FINGER_CHAINS[1]![0]!, AI_FINGER_CHAINS[2]![0]!, 13.5, AI_PROJ),
  lineOnTop(AI_FINGER_CHAINS[2]![0]!, AI_FINGER_CHAINS[3]![0]!, 13.5, AI_PROJ),
  lineOnTop(AI_FINGER_CHAINS[3]![0]!, AI_FINGER_CHAINS[4]![0]!, 13.5, AI_PROJ),
]);
const aiDistalSkeleton = joinPaths(
  AI_FINGER_CHAINS.flatMap((chain) => [
    lineOnTop(chain[1]!, chain[2]!, 13.8, AI_PROJ),
    lineOnTop(chain[2]!, chain[3]!, 13.8, AI_PROJ),
  ])
);
const aiProximalLandmarks: Flat[] = [
  iso([AI_WRIST_PT[0], AI_WRIST_PT[1], 13.6], AI_PROJ),
  ...AI_FINGER_CHAINS.flatMap((chain) =>
    chain.slice(0, 2).map(([lx, ly]) => iso([lx, ly, 13.6], AI_PROJ))
  ),
];
const aiDistalLandmarks: Flat[] = AI_FINGER_CHAINS.flatMap((chain) =>
  chain.slice(2).map(([lx, ly]) => iso([lx, ly, 13.9], AI_PROJ))
);

// Station 3 (Right): 3-Layer Neural Classifier Tensor Array
const aiTensorPlaten = slabOf({ x: 86, y: 24, w: 24, d: 32, r: 2.8 }, 5.8, 3.2, AI_PROJ, 6, 0.4);
const aiTensorNodes = [
  [91, 29, 5.5],
  [91, 39, 7.0],
  [91, 49, 5.5],
  [98, 34, 9.5],
  [98, 44, 9.5],
  [105, 39, 12.5],
].map(([nx, ny, nh]) => ({
  cyl: cylinder(nx!, ny!, 2.8, 9.0, nh!, AI_PROJ, 18),
  cap: ring(nx!, ny!, 1.5, 9.0 + nh!, AI_PROJ, 14),
}));
const aiSynapseWires = joinPaths([
  lineOnTop([91, 29], [98, 34], 14.5, AI_PROJ),
  lineOnTop([91, 39], [98, 34], 14.5, AI_PROJ),
  lineOnTop([91, 39], [98, 44], 14.5, AI_PROJ),
  lineOnTop([91, 49], [98, 44], 14.5, AI_PROJ),
  lineOnTop([98, 34], [105, 39], 18.0, AI_PROJ),
  lineOnTop([98, 44], [105, 39], 18.0, AI_PROJ),
]);

const AI_STATION_XS = [29, 65, 98] as const;
const AI_STATIONS: StationSpec[] = [
  { code: "01", label: "SAR BANKNOTE", readout: "100 SAR YOLO · TTS VOICE" },
  { code: "02", label: "21-PT HAND RIG", readout: "MEDIAPIPE 21 JOINTS · 60 FPS" },
  { code: "03", label: "MOTIONGRU TENSOR", readout: "SIGN <-> SPEECH · 98.6% CONF" },
];

function buildLaserFrustum(camX: number) {
  const apex: Point3 = [camX, 14, 34.5];
  const targets: Point3[] = [
    [camX - 11, 27, 11.5],
    [camX + 11, 27, 11.5],
    [camX + 11, 49, 11.5],
    [camX - 11, 49, 11.5],
  ];
  return joinPaths([
    ...targets.map((t) => segment(apex, t, AI_PROJ)),
    pathOf(targets.map((t) => iso(t, AI_PROJ)), true),
  ]);
}

function AiVisionHandFigure() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const [activeIdx, setActiveIdx] = React.useState(1);

  const camTargetRef = React.useRef<number>(AI_STATION_XS[1]);
  const camSpringRef = React.useRef<Spring>({ at: AI_STATION_XS[1], rate: 0 });
  const phaseRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ clientX: number; clientY: number; startX: number } | null>(null);
  const pauseUntilRef = React.useRef(0);

  const camGroupRef = React.useRef<SVGGElement>(null);
  const laserGroupRef = React.useRef<SVGGElement>(null);
  const fingerTipGroupRef = React.useRef<SVGGElement>(null);

  const kick = useLoop((dt, calm) => {
    phaseRef.current += calm ? 0 : dt;
    const t = phaseRef.current;

    spring(camSpringRef.current, camTargetRef.current, dt, 185, 19, calm);
    const camX = camSpringRef.current.at + (calm ? 0 : Math.sin(t * 2.1) * 1.4);

    camGroupRef.current?.setAttribute(
      "transform",
      `translate(${(AI_AXIS_X[0] * camX).toFixed(2)} ${(AI_AXIS_X[1] * camX).toFixed(2)})`
    );

    const laserPath = laserGroupRef.current?.querySelector("path");
    if (laserPath) {
      laserPath.setAttribute("d", buildLaserFrustum(camX));
    }

    // Flex distal finger joints up/down gently in idle & when hand is scanned
    const fingerLift = calm ? 0 : (Math.sin(t * 3.0) + 1) * 1.15;
    fingerTipGroupRef.current?.setAttribute(
      "transform",
      `translate(${(AI_AXIS_Z[0] * fingerLift).toFixed(2)} ${(AI_AXIS_Z[1] * fingerLift).toFixed(2)})`
    );

    return inView || draggingRef.current;
  }, true);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, kick]);

  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingRef.current || Date.now() < pauseUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % AI_STATIONS.length;
        camTargetRef.current = AI_STATION_XS[next] ?? 65;
        kick();
        return next;
      });
    }, 2700);
    return () => window.clearInterval(timer);
  }, [inView, kick]);

  const selectStation = (idx: number) => {
    pauseUntilRef.current = Date.now() + 6000;
    playMechanicalClick(630 + idx * 70);
    setActiveIdx(idx);
    camTargetRef.current = AI_STATION_XS[idx] ?? 65;
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    pauseUntilRef.current = Date.now() + 8000;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    playMechanicalClick(540);
    grabRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: camTargetRef.current,
    };
    kick();
  };

  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    const grab = grabRef.current;
    const svg = e.currentTarget.ownerSVGElement;
    if (!grab || !svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - grab.clientX) * (WIDTH / rect.width);
    const dy = (e.clientY - grab.clientY) * (HEIGHT / rect.height);
    const deltaAlongX =
      (dx * AI_AXIS_X[0] + dy * AI_AXIS_X[1]) /
      (AI_AXIS_X[0] * AI_AXIS_X[0] + AI_AXIS_X[1] * AI_AXIS_X[1]);
    camTargetRef.current = Math.max(24, Math.min(100, grab.startX + deltaAlongX));
    kick();
  };

  const onPointerEnd = () => {
    if (!grabRef.current) return;
    grabRef.current = null;
    draggingRef.current = false;
    let nearest = 0;
    let best = Infinity;
    AI_STATION_XS.forEach((sx, idx) => {
      const dist = Math.abs(sx - camTargetRef.current);
      if (dist < best) {
        best = dist;
        nearest = idx;
      }
    });
    camTargetRef.current = AI_STATION_XS[nearest] ?? 65;
    setActiveIdx(nearest);
    playMechanicalClick(680);
    kick();
  };

  return (
    <div ref={containerRef} className="svc-anatomy iso light-machine" data-cursor="DRAG SCANNER / CLICK">
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive 3D 21-Point Robotic Hand Rig and Optical Vision Gimbal"
      >
        <Solid
          paths={aiBaseSolid}
          halo
          inner={
            <>
              <Line d={aiBaseSeam} tone="faint" />
              <Line d={aiBaseInset} tone="faint" />
            </>
          }
        >
          {aiFeet.map((foot, idx) => (
            <Solid key={idx} paths={foot} tone="lo" />
          ))}
          <Line d={aiFrontTicks.minor} tone="faint" />
          <Line d={aiFrontTicks.major} tone="lo" />

          {/* Station 1: SAR 100 Banknote Platen */}
          <g onClick={() => selectStation(0)} className="cursor-pointer">
            <Solid paths={aiSarPlaten} tone="mid" lit={activeIdx === 0} halo>
              <Solid paths={aiSarNote} tone="hi">
                <Line d={aiSarSeal} tone="green" />
              </Solid>
              <FaceText transform={aiSarLabelTf} size={1.85} tone="hi">
                SAR 100 · YOLO
              </FaceText>
            </Solid>
          </g>

          {/* Station 2: 21-Point Articulated Mechanical Hand Rig */}
          <g onClick={() => selectStation(1)} className="cursor-pointer">
            <Solid paths={aiHandPedestal} tone="mid" lit={activeIdx === 1} halo>
              <Solid paths={aiWristCuff} tone="hi" />
              <Solid paths={aiPalmChassis} tone="hi" lit={activeIdx === 1} />
              {aiProximalPhalanges.map((p, idx) => (
                <Solid key={idx} paths={p} tone="hi" />
              ))}
              <Line d={aiPalmSkeleton} tone="green" />
              <Dots points={aiProximalLandmarks} size={1.15} tone="hi" />
              <g ref={fingerTipGroupRef}>
                {aiDistalPhalanges.map((p, idx) => (
                  <Solid key={idx} paths={p} tone="hi" lit={activeIdx === 1} />
                ))}
                <Line d={aiDistalSkeleton} tone="green" />
                <Dots points={aiDistalLandmarks} size={1.15} tone="hi" />
              </g>
            </Solid>
          </g>

          {/* Station 3: Neural Tensor Array */}
          <g onClick={() => selectStation(2)} className="cursor-pointer">
            <Solid paths={aiTensorPlaten} tone="mid" lit={activeIdx === 2} halo>
              <Line d={aiSynapseWires} tone="green" />
              {aiTensorNodes.map((n, idx) => (
                <Solid key={idx} paths={n.cyl} tone="hi" lit={activeIdx === 2}>
                  <Line d={n.cap} tone="green" />
                </Solid>
              ))}
            </Solid>
          </g>

          {/* Laser Scanning Frustum */}
          <g ref={laserGroupRef} className="rig-no-hit">
            <Line d={buildLaserFrustum(AI_STATION_XS[1])} tone="green" dashed />
          </g>

          {/* Overhead Optical Vision Gantry Bridge */}
          <Solid paths={aiLeftPillar} tone="mid" />
          <Solid paths={aiRightPillar} tone="mid" />
          <Solid paths={aiGantryBeam} tone="hi" halo>
            <Line d={aiGantryTicks.minor} tone="lo" />
            <Line d={aiGantryTicks.major} tone="mid" />
          </Solid>

          {/* Draggable Optical Camera Gimbal Pod */}
          <g
            ref={camGroupRef}
            className="rig-carriage-drag"
            transform={`translate(${AI_AXIS_X[0] * AI_STATION_XS[1]} ${AI_AXIS_X[1] * AI_STATION_XS[1]})`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            <Solid paths={aiCamCarriage} tone="hi" lit halo>
              <Solid paths={aiCamTurret} tone="hi" lit>
                <Line d={aiCamLensRing} tone="green" />
              </Solid>
            </Solid>
          </g>
        </Solid>
      </IsoFigure>

      <StationBar
        stations={AI_STATIONS}
        activeIdx={activeIdx}
        onSelect={selectStation}
        darkMachine={false}
      />
    </div>
  );
}

/* ============================================================================
   5. DEVOPS, VERSION CONTROL & DESIGN TOOLS
      Git Branch-Merge Switchyard + 3-Tunnel CI/CD Automated Conveyor
   ============================================================================ */
const DO_BASE: Plan = { x: 0, y: 0, w: 122, d: 72, r: 7 };
const DO_PROJ: Projection = fitProjection(
  boxCorners({ x: -2, y: -2, w: 126, d: 76, r: 0 }, -3, 42),
  WIDTH,
  HEIGHT,
  { pad: 10, headroom: 4 }
);
const DO_AXIS_X = axisVector(DO_PROJ, [1, 0, 0]);

const doBaseSolid = slabOf(DO_BASE, 0, 5.8, DO_PROJ, 8, 0.7);
const doBaseSeam = sideSeam(DO_BASE, 2.0, DO_PROJ);
const doBaseInset = planOutline(insetPlan(DO_BASE, 2.8), 5.8, DO_PROJ);
const doFeet = corners(DO_BASE, 8).map(([cx, cy]) =>
  cylinder(cx, cy, 4.2, -2.4, 2.4, DO_PROJ, 20)
);

// Figma UI Prototype Drafting Tablet at Front-Left
const doFigmaDeck = slabOf({ x: 12, y: 46, w: 34, d: 18, r: 2.5 }, 5.8, 2.4, DO_PROJ, 6, 0.35);
const doFigmaScreen = planOutline(insetPlan({ x: 12, y: 46, w: 34, d: 18, r: 2.5 }, 2.0), 8.2, DO_PROJ);
const doFigmaBezier = joinPaths([
  lineOnTop([16, 51], [26, 59], 8.2, DO_PROJ),
  lineOnTop([26, 59], [41, 51], 8.2, DO_PROJ),
]);
const doFigmaNodes = [
  iso([16, 51, 8.2], DO_PROJ),
  iso([26, 59, 8.2], DO_PROJ),
  iso([41, 51, 8.2], DO_PROJ),
];

// Git Branching Tracks (feature branch merging into main conveyor line at x = 36)
const doMainTrackBed = slabOf({ x: 12, y: 24, w: 98, d: 15, r: 2.8 }, 5.8, 2.0, DO_PROJ, 6, 0.3);
const doGitBranchWire = joinPaths([
  lineOnTop([14, 12], [26, 12], 6.4, DO_PROJ),
  lineOnTop([26, 12], [36, 26], 6.4, DO_PROJ),
  lineOnTop([15, 31.5], [106, 31.5], 7.8, DO_PROJ),
]);
const doCommitTurrets = [
  cylinder(16, 12, 2.6, 5.8, 3.2, DO_PROJ, 18),
  cylinder(25, 12, 2.6, 5.8, 3.2, DO_PROJ, 18),
  cylinder(20, 31.5, 2.8, 7.8, 3.0, DO_PROJ, 18),
];

// 3 Stepped CI/CD Inspection & Deployment Tunnel Gates Spanning the Conveyor Track
// Each tunnel is split into Back Pillar, Front Pillar, and Top Bridge so the Release Pod passes cleanly through!
const DO_GATES = [
  { idx: 0, x: 38, h: 16.5, label: "GIT MERGE" },
  { idx: 1, x: 64, h: 20.0, label: "LINT & TS" },
  { idx: 2, x: 90, h: 23.5, label: "EDGE LIVE" },
].map((g) => {
  const pillarBack = slabOf({ x: g.x, y: 18.5, w: 12, d: 5.2, r: 1.5 }, 5.8, g.h, DO_PROJ, 4);
  const pillarFront = slabOf({ x: g.x, y: 39.2, w: 12, d: 5.2, r: 1.5 }, 5.8, g.h, DO_PROJ, 4);
  const bridgeZ = 5.8 + g.h;
  const bridge = slabOf({ x: g.x - 0.8, y: 18.0, w: 13.6, d: 27.0, r: 2.2 }, bridgeZ, 3.6, DO_PROJ, 6, 0.45);
  const beacon = cylinder(g.x + 6, 24.5, 2.8, bridgeZ + 3.6, 2.2, DO_PROJ, 18);
  const beaconRing = ring(g.x + 6, 24.5, 1.5, bridgeZ + 5.8, DO_PROJ, 14);
  const labelTf = topMatrix([g.x + 1.0, 41.5], bridgeZ + 3.6, DO_PROJ);
  return { ...g, pillarBack, pillarFront, bridge, beacon, beaconRing, labelTf };
});

// Moving Release Capsule Pod (built at x = 0, translated along X = 20 .. 92)
const doPodBody = slabOf({ x: -6.5, y: 26.2, w: 13, d: 10.6, r: 2.2 }, 8.0, 6.2, DO_PROJ, 6, 0.45);
const doPodCore = cylinder(0, 31.5, 3.2, 14.2, 2.2, DO_PROJ, 20);
const doPodRing = ring(0, 31.5, 1.7, 16.4, DO_PROJ, 16);

// Production Telemetry Dial at Front-Right
const doDialBody = cylinder(96, 56, 8.8, 5.8, 3.2, DO_PROJ, 28);
const doDialKnurl = knurl(96, 56, 8.8, 5.8, 9.0, 20, DO_PROJ);
const doDialTicks = radialTicks(96, 56, 7.2, 16, 4, 9.0, [1.2, 2.2], DO_PROJ);

const DO_STATION_XS = [22, 44, 70, 96] as const;
const DO_STATIONS: StationSpec[] = [
  { code: "01", label: "GIT & FIGMA", readout: "@FADLI154 COMMIT · SHA VERIFIED" },
  { code: "02", label: "MERGE GATE", readout: "PR BRANCH MERGED · CLEAN TREE" },
  { code: "03", label: "LINT & BUILD", readout: "TSC --NOEMIT · SSR BUNDLE OK" },
  { code: "04", label: "EDGE DEPLOY", readout: "PRODUCTION LIVE · 99.9% UP" },
];

function DevopsConveyorFigure() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef);
  const [activeIdx, setActiveIdx] = React.useState(2);

  const podTargetRef = React.useRef<number>(DO_STATION_XS[2]);
  const podSpringRef = React.useRef<Spring>({ at: DO_STATION_XS[2], rate: 0 });
  const phaseRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ clientX: number; clientY: number; startX: number } | null>(null);
  const pauseUntilRef = React.useRef(0);

  const podGroupRef = React.useRef<SVGGElement>(null);
  const dialHandRef = React.useRef<SVGGElement>(null);

  const kick = useLoop((dt, calm) => {
    phaseRef.current += calm ? 0 : dt;
    const t = phaseRef.current;

    spring(podSpringRef.current, podTargetRef.current, dt, 185, 19, calm);
    const podX = podSpringRef.current.at + (calm ? 0 : Math.sin(t * 2.4) * 1.2);

    podGroupRef.current?.setAttribute(
      "transform",
      `translate(${(DO_AXIS_X[0] * podX).toFixed(2)} ${(DO_AXIS_X[1] * podX).toFixed(2)})`
    );

    const dialPath = dialHandRef.current?.querySelector("path");
    if (dialPath) {
      const share = (podX - 20) / 78;
      const angle = -Math.PI * 0.75 + share * Math.PI * 1.5;
      dialPath.setAttribute(
        "d",
        lineOnTop(
          [96, 56],
          [96 + Math.sin(angle) * 6.4, 56 - Math.cos(angle) * 6.4],
          9.2,
          DO_PROJ
        )
      );
    }

    return inView || draggingRef.current;
  }, true);

  React.useEffect(() => {
    if (inView) kick();
  }, [inView, kick]);

  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingRef.current || Date.now() < pauseUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % DO_STATIONS.length;
        podTargetRef.current = DO_STATION_XS[next] ?? 70;
        kick();
        return next;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [inView, kick]);

  const selectStation = (idx: number) => {
    pauseUntilRef.current = Date.now() + 6000;
    playMechanicalClick(620 + idx * 65);
    setActiveIdx(idx);
    podTargetRef.current = DO_STATION_XS[idx] ?? 70;
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    pauseUntilRef.current = Date.now() + 8000;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    playMechanicalClick(530);
    grabRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: podTargetRef.current,
    };
    kick();
  };

  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    const grab = grabRef.current;
    const svg = e.currentTarget.ownerSVGElement;
    if (!grab || !svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - grab.clientX) * (WIDTH / rect.width);
    const dy = (e.clientY - grab.clientY) * (HEIGHT / rect.height);
    const deltaAlongX =
      (dx * DO_AXIS_X[0] + dy * DO_AXIS_X[1]) /
      (DO_AXIS_X[0] * DO_AXIS_X[0] + DO_AXIS_X[1] * DO_AXIS_X[1]);
    podTargetRef.current = Math.max(20, Math.min(98, grab.startX + deltaAlongX));
    kick();
  };

  const onPointerEnd = () => {
    if (!grabRef.current) return;
    grabRef.current = null;
    draggingRef.current = false;
    let nearest = 0;
    let best = Infinity;
    DO_STATION_XS.forEach((sx, idx) => {
      const dist = Math.abs(sx - podTargetRef.current);
      if (dist < best) {
        best = dist;
        nearest = idx;
      }
    });
    podTargetRef.current = DO_STATION_XS[nearest] ?? 70;
    setActiveIdx(nearest);
    playMechanicalClick(680);
    kick();
  };

  return (
    <div ref={containerRef} className="svc-anatomy iso dark-machine" data-cursor="DRAG POD / CLICK">
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive 3D Git Branching Switchyard and CI/CD Automated Conveyor"
      >
        <Solid
          paths={doBaseSolid}
          halo
          inner={
            <>
              <Line d={doBaseSeam} tone="faint" />
              <Line d={doBaseInset} tone="faint" />
            </>
          }
        >
          {doFeet.map((foot, idx) => (
            <Solid key={idx} paths={foot} tone="lo" />
          ))}

          {/* Git Branch Track & Conveyor Bed */}
          <Solid paths={doMainTrackBed} tone="mid" />
          <Line d={doGitBranchWire} tone="green" flow />
          {doCommitTurrets.map((t, idx) => (
            <Solid key={idx} paths={t} tone="hi" lit={activeIdx === 0} />
          ))}

          {/* Back Pillars of the 3 CI/CD Tunnel Gates (drawn behind Release Pod) */}
          {DO_GATES.map((g) => (
            <Solid key={`back-${g.idx}`} paths={g.pillarBack} tone="mid" />
          ))}

          {/* Draggable Illuminated CI/CD Release Pod */}
          <g
            ref={podGroupRef}
            className="rig-carriage-drag"
            transform={`translate(${DO_AXIS_X[0] * DO_STATION_XS[2]} ${DO_AXIS_X[1] * DO_STATION_XS[2]})`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            <Solid paths={doPodBody} tone="hi" lit halo>
              <Solid paths={doPodCore} tone="hi" lit>
                <Line d={doPodRing} tone="green" />
              </Solid>
            </Solid>
          </g>

          {/* Front Pillars & Overhead Arch Bridges of the 3 CI/CD Tunnel Gates */}
          {DO_GATES.map((g, idx) => (
            <g key={`front-${g.idx}`} onClick={() => selectStation(idx + 1)} className="cursor-pointer">
              <Solid paths={g.pillarFront} tone="mid" />
              <Solid paths={g.bridge} tone="hi" lit={activeIdx === idx + 1} halo>
                <FaceText transform={g.labelTf} size={1.85} tone="hi">
                  {g.label}
                </FaceText>
                <Solid paths={g.beacon} tone="hi" lit={activeIdx === idx + 1}>
                  <Line d={g.beaconRing} tone="green" />
                </Solid>
              </Solid>
            </g>
          ))}

          {/* Front-Left: Figma Prototype Drafting Tablet */}
          <g onClick={() => selectStation(0)} className="cursor-pointer">
            <Solid paths={doFigmaDeck} tone="hi" lit={activeIdx === 0} halo>
              <Line d={doFigmaScreen} tone="mid" />
              <Line d={doFigmaBezier} tone="green" />
              <Dots points={doFigmaNodes} size={0.85} tone="hi" />
            </Solid>
          </g>

          {/* Front-Right: Production Uptime Telemetry Dial */}
          <Solid paths={doDialBody} tone="mid" inner={<Line d={doDialKnurl} tone="faint" />}>
            <Line d={doDialTicks.minor} tone="lo" />
            <Line d={doDialTicks.major} tone="mid" />
            <g ref={dialHandRef}>
              <Line d={lineOnTop([96, 56], [96, 49.6], 9.2, DO_PROJ)} tone="green" />
            </g>
          </Solid>
        </Solid>
      </IsoFigure>

      <StationBar
        stations={DO_STATIONS}
        activeIdx={activeIdx}
        onSelect={selectStation}
        darkMachine={true}
      />
    </div>
  );
}

/* ============================================================================
   PUBLIC DISPATCHER FOR THE 5 TECH STACK CARDS
   ============================================================================ */
export function KeffiStackFigure({ id }: { id: string }) {
  switch (id) {
    case "frontend":
      return <FrontendWorkstationFigure />;
    case "backend":
      return <BackendVaultFigure />;
    case "mobile":
      return <MobileLayeredPhoneFigure />;
    case "ai-cv":
      return <AiVisionHandFigure />;
    case "devops":
      return <DevopsConveyorFigure />;
    default:
      return <FrontendWorkstationFigure />;
  }
}
