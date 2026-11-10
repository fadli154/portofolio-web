"use client";

import React from "react";
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
  planOutline,
  radialTicks,
  ring,
  rise,
  sideMatrix,
  sideRing,
  sideSeam,
  sideTicks,
  slabOf,
  topMatrix,
  topTicks,
  type Plan,
  type Point3,
} from "../iso/iso-kit";
import { Dots, FaceText, IsoFigure, Line, Solid, Wire } from "../iso/react/draw";
import { follow, spring, useLoop, type Spring } from "../iso/react/live";
import "../iso/iso.css";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

const WIDTH = 660;
const HEIGHT = 380;

const BASE: Plan = { x: 0, y: 0, w: 120, d: 68, r: 8 };
const BASE_Z = 0;
const BASE_H = 7.5;
const TOP_Z = BASE_Z + BASE_H;

const GROOVE: Plan = { x: 14, y: 27, w: 92, d: 21, r: 3.5 };
const GROOVE_H = 1.6;
const GROOVE_Z = TOP_Z;

const RULER: Plan = { x: 14, y: 51, w: 92, d: 5.2, r: 1.4 };
const RULER_H = 0.8;

const RAIL_FROM = 18;
const RAIL_TO = 102;
const RAIL_YS = [33, 42] as const;
const RAIL_Z = GROOVE_Z + GROOVE_H + 3.1;

const STOP_W = 5.2;
const STOP_D = 17.5;
const STOP_H = 9.2;
const LEFT_STOP: Plan = { x: RAIL_FROM - STOP_W, y: 28.5, w: STOP_W, d: STOP_D, r: 1.8 };
const RIGHT_STOP: Plan = { x: RAIL_TO, y: 28.5, w: STOP_W, d: STOP_D, r: 1.8 };

const CAR_W = 16;
const CAR_D = 17.5;
const CAR_H = 8.4;
const CAR_Z = GROOVE_Z + GROOVE_H + 0.8;
const CAR_MIN = RAIL_FROM + 2;
const CAR_MAX = RAIL_TO - CAR_W - 2;

const COIL_R = 2.05;
const COIL_TURNS = 7;

const DIAL_C: [number, number] = [104, 13.5];
const DIAL_R = 9.2;
const DIAL_H = 3.2;
const DIAL_TOP = TOP_Z + DIAL_H;

const PLUNGER_R = 4.2;
const PLUNGER_H = 5.0;
const PLUNGER_TRAVEL = 3.0;

const PROJECTION = fitProjection(
  boxCorners(BASE, BASE_Z - 3.5, CAR_Z + CAR_H + PLUNGER_H + 14),
  WIDTH,
  HEIGHT,
  { pad: 24, headroom: 8 }
);

const AXIS_X = axisVector(PROJECTION, [1, 0, 0]);
const AXIS_Z = axisVector(PROJECTION, [0, 0, 1]);

// Shared Static Bench Geometry (50+ precision parts)
const baseSolid = slabOf(BASE, BASE_Z, BASE_H, PROJECTION, 8, 0.85);
const baseSeam = sideSeam(BASE, BASE_Z + 2.0, PROJECTION);
const baseInnerLip = planOutline(insetPlan(BASE, 3.0), TOP_Z, PROJECTION);

const feetSolids = corners(BASE, 9).map(([cx, cy]) =>
  cylinder(cx, cy, 4.6, BASE_Z - 2.6, 2.6, PROJECTION, 24)
);

const cornerScrews = corners(BASE, 6.2).map(([cx, cy]) => ({
  well: ring(cx, cy, 2.0, TOP_Z, PROJECTION, 20),
  slot: joinPaths([
    lineOnTop([cx - 1.0, cy], [cx + 1.0, cy], TOP_Z, PROJECTION),
    lineOnTop([cx, cy - 1.0], [cx, cy + 1.0], TOP_Z, PROJECTION),
  ]),
}));

const baseDots = dotGrid(14, 59, 23, 2, 4, TOP_Z, PROJECTION);
const grooveSolid = slabOf(GROOVE, GROOVE_Z, GROOVE_H, PROJECTION, 6);
const grooveInner = planOutline(insetPlan(GROOVE, 1.8), GROOVE_Z + GROOVE_H, PROJECTION);
const grooveTracks = RAIL_YS.map((y) =>
  lineOnTop([RAIL_FROM, y], [RAIL_TO, y], GROOVE_Z + GROOVE_H, PROJECTION)
);

const rulerSolid = slabOf(RULER, TOP_Z, RULER_H, PROJECTION, 4);
const rulerTicks = topTicks(18, 102, 1.5, 4, RULER.y, TOP_Z + RULER_H, [1.8, 3.5], PROJECTION);
const frontScale = sideTicks(18, 102, 2, 5, BASE.d, TOP_Z - 1.0, [1.2, 2.4], PROJECTION);

const LABEL_PLAN: Plan = { x: 16, y: 58.2, w: 50, d: 6.5, r: 1.4 };
const labelPlate = slabOf(LABEL_PLAN, TOP_Z, 0.65, PROJECTION, 4);
const labelRivets = [
  iso([LABEL_PLAN.x + 2.2, LABEL_PLAN.y + LABEL_PLAN.d / 2, TOP_Z + 0.65], PROJECTION),
  iso([LABEL_PLAN.x + LABEL_PLAN.w - 2.2, LABEL_PLAN.y + LABEL_PLAN.d / 2, TOP_Z + 0.65], PROJECTION),
];
const labelTextTf = topMatrix([LABEL_PLAN.x + 4.4, LABEL_PLAN.y + 4.4], TOP_Z + 0.65, PROJECTION);
const frontFaceTf = sideMatrix([16, BASE.d], TOP_Z - 3.6, PROJECTION, "left");

const leftStop = slabOf(LEFT_STOP, TOP_Z, STOP_H, PROJECTION, 5, 0.45);
const rightStop = slabOf(RIGHT_STOP, TOP_Z, STOP_H, PROJECTION, 5, 0.45);

const railsGeo = RAIL_YS.map((y) => ({
  upper: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], RAIL_Z + 0.45, PROJECTION),
  lower: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], RAIL_Z - 0.45, PROJECTION),
  shadow: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], GROOVE_Z + GROOVE_H, PROJECTION),
  leftSocket: sideRing([RAIL_FROM, y, RAIL_Z], 1.35, "x", PROJECTION),
  rightSocket: sideRing([RAIL_TO, y, RAIL_Z], 1.35, "x", PROJECTION),
}));

const dialSolid = cylinder(DIAL_C[0], DIAL_C[1], DIAL_R, TOP_Z, DIAL_H, PROJECTION, 36, 0.45);
const dialKnurl = knurl(DIAL_C[0], DIAL_C[1], DIAL_R, TOP_Z, DIAL_TOP, 32, PROJECTION, 0.5);
const dialFace = ring(DIAL_C[0], DIAL_C[1], DIAL_R - 1.3, DIAL_TOP, PROJECTION, 36);
const dialInner = ring(DIAL_C[0], DIAL_C[1], DIAL_R - 3.5, DIAL_TOP, PROJECTION, 28);
const dialTicks = radialTicks(DIAL_C[0], DIAL_C[1], DIAL_R - 1.5, 24, 4, DIAL_TOP, [1.1, 2.2], PROJECTION);
const dialPin = iso([DIAL_C[0], DIAL_C[1], DIAL_TOP], PROJECTION);
const dialWireFrom = iso([DIAL_C[0] - DIAL_R, DIAL_C[1], TOP_Z + 1.0], PROJECTION);
const dialWireVia = iso([94, DIAL_C[1], TOP_Z + 1.0], PROJECTION);
const dialWireTo = iso([94, GROOVE.y, TOP_Z + 1.0], PROJECTION);

const CAR_ORIGIN: Plan = { x: 0, y: 28.5, w: CAR_W, d: CAR_D, r: 2.2 };
const CAR_TOP = CAR_Z + CAR_H;
const WIN_PLAN = insetPlan(CAR_ORIGIN, 2.8);

const carriageSolid = slabOf(CAR_ORIGIN, CAR_Z, CAR_H, PROJECTION, 6, 0.55);
const carriageSeam = sideSeam(CAR_ORIGIN, CAR_Z + 2.4, PROJECTION);
const carriageWindow = slabOf(WIN_PLAN, CAR_TOP - 1.1, 1.1, PROJECTION, 4);
const carriageCross = joinPaths([
  lineOnTop([CAR_W / 2, WIN_PLAN.y + 1.2], [CAR_W / 2, WIN_PLAN.y + WIN_PLAN.d - 1.2], CAR_TOP, PROJECTION),
  lineOnTop([WIN_PLAN.x + 1.2, 28.5 + CAR_D / 2], [WIN_PLAN.x + WIN_PLAN.w - 1.2, 28.5 + CAR_D / 2], CAR_TOP, PROJECTION),
]);
const carriageCenter = iso([CAR_W / 2, 28.5 + CAR_D / 2, CAR_TOP], PROJECTION);
const carriageBushings = RAIL_YS.flatMap((y) => [
  sideRing([0, y, RAIL_Z], 1.7, "x", PROJECTION),
  sideRing([CAR_W, y, RAIL_Z], 1.7, "x", PROJECTION),
]);
const carriageTextTf = sideMatrix([2.0, 28.5 + CAR_D], CAR_TOP - 2.6, PROJECTION, "left");

const PLUNGER_C: [number, number] = [CAR_W / 2, 28.5 + CAR_D / 2];
const PLUNGER_Z = CAR_TOP + 2.2;
const PLUNGER_TOP = PLUNGER_Z + PLUNGER_H;

const plungerStem = rise(PLUNGER_C, CAR_TOP, PLUNGER_Z, PROJECTION);
const plungerSolid = cylinder(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R, PLUNGER_Z, PLUNGER_H, PROJECTION, 28, 0.35);
const plungerKnurl = knurl(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R, PLUNGER_Z, PLUNGER_TOP, 22, PROJECTION, 0.45);
const plungerCap = ring(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R - 1.2, PLUNGER_TOP, PROJECTION, 24);
const plungerArrow = joinPaths([
  lineOnTop([PLUNGER_C[0] - 1.7, PLUNGER_C[1]], [PLUNGER_C[0] + 1.7, PLUNGER_C[1]], PLUNGER_TOP, PROJECTION),
  lineOnTop([PLUNGER_C[0] + 0.5, PLUNGER_C[1] - 1.1], [PLUNGER_C[0] + 1.7, PLUNGER_C[1]], PLUNGER_TOP, PROJECTION),
  lineOnTop([PLUNGER_C[0] + 0.5, PLUNGER_C[1] + 1.1], [PLUNGER_C[0] + 1.7, PLUNGER_C[1]], PLUNGER_TOP, PROJECTION),
]);

const reticleRing = ring(CAR_W / 2, 28.5 + CAR_D / 2, 2.9, GROOVE_Z + GROOVE_H, PROJECTION, 24);
const reticleTicks = radialTicks(
  CAR_W / 2,
  28.5 + CAR_D / 2,
  4.2,
  4,
  1,
  GROOVE_Z + GROOVE_H,
  [1.4, 1.4],
  PROJECTION
).major;
const reticleStem = rise([CAR_W / 2, 28.5 + CAR_D / 2], GROOVE_Z + GROOVE_H, CAR_Z, PROJECTION);

// ============================================================================
// DOMAIN-SPECIFIC REAR DECK 3D HARDWARE ASSEMBLIES FOR ALL 5 MACHINES
// ============================================================================

// 1. FRONTEND: Tall Workstation Monitor Tower + 10-Key Mechanical Deck + 3 Responsive Viewport Plates
const feMonitorPlinth = slabOf({ x: 14, y: 3.5, w: 34, d: 15.5, r: 2.2 }, TOP_Z, 2.6, PROJECTION, 6);
const feMonitorCase = slabOf({ x: 13, y: 2.5, w: 36, d: 13.5, r: 2.8 }, TOP_Z + 2.6, 19.5, PROJECTION, 6, 0.7);
const feMonitorTop = TOP_Z + 22.1;
const feMonitorHandle = planOutline({ x: 21, y: 5.0, w: 20, d: 3.5, r: 1.5 }, feMonitorTop, PROJECTION, 6);
const feMonitorScreen = joinPaths([
  iso([16, 16.02, TOP_Z + 5.2], PROJECTION) &&
    `M${iso([16, 16.02, TOP_Z + 5.2], PROJECTION).join(",")}L${iso([46, 16.02, TOP_Z + 5.2], PROJECTION).join(",")}L${iso([46, 16.02, TOP_Z + 19.2], PROJECTION).join(",")}L${iso([16, 16.02, TOP_Z + 19.2], PROJECTION).join(",")}Z`,
  `M${iso([19, 16.05, TOP_Z + 8.5], PROJECTION).join(",")}L${iso([43, 16.05, TOP_Z + 8.5], PROJECTION).join(",")}`,
  `M${iso([19, 16.05, TOP_Z + 12.5], PROJECTION).join(",")}L${iso([38, 16.05, TOP_Z + 12.5], PROJECTION).join(",")}`,
  `M${iso([19, 16.05, TOP_Z + 16.0], PROJECTION).join(",")}L${iso([43, 16.05, TOP_Z + 16.0], PROJECTION).join(",")}`,
]);
const feMonitorLabelTf = topMatrix([17.5, 12.8], feMonitorTop, PROJECTION);
const feKeycaps = [0, 1, 2, 3, 4, 5].map((idx) =>
  slabOf({ x: 14.5 + idx * 5.6, y: 19.0, w: 4.6, d: 4.5, r: 0.8 }, TOP_Z, 2.1, PROJECTION, 4)
);
const feViewports = [
  { code: "390PX", label: "MOBILE", plan: { x: 53, y: 5, w: 12, d: 15, r: 1.8 }, h: 7.5, cx: 30 },
  { code: "768PX", label: "TABLET", plan: { x: 68, y: 5, w: 13, d: 15, r: 1.8 }, h: 11.2, cx: 58 },
  { code: "1440PX", label: "DESKTOP", plan: { x: 84, y: 5, w: 14, d: 15, r: 1.8 }, h: 15.0, cx: 82 },
].map((vp) => {
  const solid = slabOf(vp.plan, TOP_Z, vp.h, PROJECTION, 6, 0.5);
  const topZ = TOP_Z + vp.h;
  const frame = planOutline(insetPlan(vp.plan, 1.6), topZ, PROJECTION);
  const labelTf = topMatrix([vp.plan.x + 1.6, vp.plan.y + vp.plan.d - 2.2], topZ, PROJECTION);
  const busFrom = iso([vp.plan.x + vp.plan.w / 2, vp.plan.y + vp.plan.d, TOP_Z + 0.8], PROJECTION);
  const busTo = iso([vp.plan.x + vp.plan.w / 2, GROOVE.y, TOP_Z + 0.8], PROJECTION);
  return { ...vp, solid, frame, labelTf, busFrom, busTo };
});

// 2. BACKEND: 3 Multi-Tier Cylindrical Relational Storage Silos + Knurled Rims + RBAC Spindles
const beDrums = [
  { code: "NIK_DB", label: "CITIZENS", cx: 26, cy: 12.5, r: 10.2, h: 10.5, targetX: 28 },
  { code: "CENSUS", label: "KK_RTRW", cx: 54, cy: 12.5, r: 10.2, h: 14.2, targetX: 54 },
  { code: "RBAC", label: "AUTH_RLS", cx: 82, cy: 12.5, r: 10.2, h: 18.0, targetX: 80 },
].map((drum) => {
  const topZ = TOP_Z + drum.h;
  const body = cylinder(drum.cx, drum.cy, drum.r, TOP_Z, drum.h, PROJECTION, 36, 0.55);
  const bodyKnurl = knurl(drum.cx, drum.cy, drum.r, TOP_Z, topZ, 28, PROJECTION, 0.55);
  const midPlatterRing = ring(drum.cx, drum.cy, drum.r, TOP_Z + drum.h * 0.5, PROJECTION, 28);
  const outerRing = ring(drum.cx, drum.cy, drum.r - 1.5, topZ, PROJECTION, 28);
  const innerHub = cylinder(drum.cx, drum.cy, 3.6, topZ, 2.8, PROJECTION, 24);
  const ticks = radialTicks(drum.cx, drum.cy, drum.r - 1.8, 16, 4, topZ, [1.2, 2.4], PROJECTION);
  const labelTf = topMatrix([drum.cx - 5.4, drum.cy + 6.4], topZ, PROJECTION);
  const busFrom = iso([drum.cx, drum.cy + drum.r, TOP_Z + 0.8], PROJECTION);
  const busTo = iso([drum.cx, GROOVE.y, TOP_Z + 0.8], PROJECTION);
  return {
    ...drum,
    body,
    bodyKnurl,
    midPlatterRing,
    outerRing,
    innerHub,
    ticks,
    labelTf,
    busFrom,
    busTo,
  };
});

// 3. MOBILE: Elevated Gimbal-Mounted 3D Smartphone Chassis + Triple Camera Lens Turret + Sensor Analyzer Towers
const mobCradleLeft = slabOf({ x: 16, y: 6, w: 6, d: 14, r: 1.2 }, TOP_Z, 3.2, PROJECTION, 4);
const mobCradleRight = slabOf({ x: 52, y: 6, w: 6, d: 14, r: 1.2 }, TOP_Z, 3.2, PROJECTION, 4);
const mobPhoneSlab = slabOf({ x: 14, y: 3.5, w: 46, d: 18.0, r: 3.2 }, TOP_Z + 3.2, 5.6, PROJECTION, 8, 0.55);
const mobPhoneTop = TOP_Z + 8.8;
const mobScreenBezel = planOutline(insetPlan({ x: 14, y: 3.5, w: 46, d: 18.0, r: 3.2 }, 2.2), mobPhoneTop, PROJECTION, 6);
const mobCamTurret = cylinder(22.5, 9.8, 4.4, mobPhoneTop, 3.0, PROJECTION, 28, 0.3);
const mobCamKnurl = knurl(22.5, 9.8, 4.4, mobPhoneTop, mobPhoneTop + 3.0, 20, PROJECTION, 0.35);
const mobCamLens = ring(22.5, 9.8, 2.3, mobPhoneTop + 3.0, PROJECTION, 20);
const mobSubCam = cylinder(22.5, 16.5, 2.6, mobPhoneTop, 2.0, PROJECTION, 22);
const mobPhoneLabelTf = topMatrix([30, 15.5], mobPhoneTop, PROJECTION);
const mobSensors = [
  { code: "60FPS", label: "FLUTTER UI", plan: { x: 64, y: 5, w: 15, d: 15, r: 2.2 }, h: 11.5, cx: 68 },
  { code: "SENSOR", label: "CAM & TTS", plan: { x: 82, y: 5, w: 15, d: 15, r: 2.2 }, h: 15.2, cx: 84 },
].map((s) => {
  const topZ = TOP_Z + s.h;
  const solid = slabOf(s.plan, TOP_Z, s.h, PROJECTION, 6, 0.45);
  const turret = cylinder(s.plan.x + s.plan.w / 2, s.plan.y + s.plan.d / 2, 3.2, topZ, 2.4, PROJECTION, 22);
  const labelTf = topMatrix([s.plan.x + 1.8, s.plan.y + s.plan.d - 2.2], topZ, PROJECTION);
  const busFrom = iso([s.plan.x + s.plan.w / 2, s.plan.y + s.plan.d, TOP_Z + 0.8], PROJECTION);
  const busTo = iso([s.plan.x + s.plan.w / 2, GROOVE.y, TOP_Z + 0.8], PROJECTION);
  return { ...s, solid, turret, labelTf, busFrom, busTo };
});

// 4. AI & COMPUTER VISION: Overhead Optical Scanner Gantry Arch + SAR 100 Plate + 21-Joint Articulated Hand Rig
const aiGantryLeftPillar = slabOf({ x: 14, y: 3.5, w: 5.5, d: 5.5, r: 1.0 }, TOP_Z, 18.0, PROJECTION, 4);
const aiGantryRightPillar = slabOf({ x: 46.5, y: 3.5, w: 5.5, d: 5.5, r: 1.0 }, TOP_Z, 18.0, PROJECTION, 4);
const aiGantryBridge = slabOf({ x: 13, y: 2.8, w: 40, d: 7.0, r: 1.5 }, TOP_Z + 18.0, 3.6, PROJECTION, 6);
const aiGantryLens = cylinder(33, 6.3, 3.8, TOP_Z + 21.6, 2.6, PROJECTION, 24);
const aiGantryLaser = joinPaths([
  `M${iso([33, 6.3, TOP_Z + 18.0], PROJECTION).join(",")}L${iso([24, 13.0, TOP_Z + 3.6], PROJECTION).join(",")}`,
  `M${iso([33, 6.3, TOP_Z + 18.0], PROJECTION).join(",")}L${iso([42, 13.0, TOP_Z + 3.6], PROJECTION).join(",")}`,
]);
const aiSarPlate = slabOf({ x: 18, y: 8.5, w: 30, d: 13.5, r: 1.8 }, TOP_Z, 3.6, PROJECTION, 6, 0.35);
const aiSarTop = TOP_Z + 3.6;
const aiSarBorder = planOutline(insetPlan({ x: 18, y: 8.5, w: 30, d: 13.5, r: 1.8 }, 1.8), aiSarTop, PROJECTION, 4);
const aiSarSeal = ring(39, 15.2, 3.4, aiSarTop, PROJECTION, 24);
const aiSarLabelTf = topMatrix([20.5, 17.2], aiSarTop, PROJECTION);

const aiHandBase = slabOf({ x: 54, y: 4.5, w: 42, d: 16.5, r: 2.4 }, TOP_Z, 5.2, PROJECTION, 6, 0.45);
const aiHandTop = TOP_Z + 5.2;
const aiHandJointCoords: [number, number][] = [
  [75, 18.0], // Wrist root
  [61, 14.2],
  [58, 8.5],
  [67.5, 13.0],
  [66.5, 7.2],
  [75, 12.5],
  [75, 6.6],
  [82.5, 13.0],
  [83.5, 7.2],
  [89, 14.4],
  [91, 9.0],
];
const aiHandTurrets = aiHandJointCoords.map(([jx, jy], idx) =>
  cylinder(jx, jy, idx === 0 ? 2.8 : 1.7, aiHandTop, idx === 0 ? 3.2 : 2.4, PROJECTION, 18)
);
const aiHandBones = joinPaths([
  lineOnTop([75, 18.0], [61, 14.2], aiHandTop + 2.2, PROJECTION),
  lineOnTop([61, 14.2], [58, 8.5], aiHandTop + 2.2, PROJECTION),
  lineOnTop([75, 18.0], [67.5, 13.0], aiHandTop + 2.2, PROJECTION),
  lineOnTop([67.5, 13.0], [66.5, 7.2], aiHandTop + 2.2, PROJECTION),
  lineOnTop([75, 18.0], [75, 12.5], aiHandTop + 2.2, PROJECTION),
  lineOnTop([75, 12.5], [75, 6.6], aiHandTop + 2.2, PROJECTION),
  lineOnTop([75, 18.0], [82.5, 13.0], aiHandTop + 2.2, PROJECTION),
  lineOnTop([82.5, 13.0], [83.5, 7.2], aiHandTop + 2.2, PROJECTION),
  lineOnTop([75, 18.0], [89, 14.4], aiHandTop + 2.2, PROJECTION),
  lineOnTop([89, 14.4], [91, 9.0], aiHandTop + 2.2, PROJECTION),
]);

// 5. DEVOPS: 4 Stepped Automated CI/CD Server Blades + Overhead Pipeline Bus Conduit
const devopsStations = [
  { code: "01", label: "GIT COMMIT", plan: { x: 16, y: 5, w: 16, d: 15, r: 2.2 }, h: 8.5, cx: 24 },
  { code: "02", label: "LINT & TS", plan: { x: 37, y: 5, w: 16, d: 15, r: 2.2 }, h: 11.5, cx: 45 },
  { code: "03", label: "BUILD", plan: { x: 58, y: 5, w: 16, d: 15, r: 2.2 }, h: 14.5, cx: 66 },
  { code: "04", label: "DEPLOY", plan: { x: 79, y: 5, w: 16, d: 15, r: 2.2 }, h: 17.5, cx: 87 },
].map((st) => {
  const topZ = TOP_Z + st.h;
  const tower = slabOf(st.plan, TOP_Z, st.h, PROJECTION, 6, 0.5);
  const cap = planOutline(insetPlan(st.plan, 1.8), topZ, PROJECTION);
  const coreX = st.plan.x + st.plan.w / 2;
  const coreY = st.plan.y + st.plan.d / 2;
  const turret = cylinder(coreX, coreY, 3.2, topZ, 2.4, PROJECTION, 22);
  const turretRing = ring(coreX, coreY, 1.7, topZ + 2.4, PROJECTION, 18);
  const labelTf = topMatrix([st.plan.x + 2.0, st.plan.y + st.plan.d - 2.2], topZ, PROJECTION);
  const busFrom = iso([coreX, st.plan.y + st.plan.d, TOP_Z + 0.8], PROJECTION);
  const busTo = iso([coreX, GROOVE.y, TOP_Z + 0.8], PROJECTION);
  return { ...st, tower, cap, turret, turretRing, labelTf, busFrom, busTo };
});

// ============================================================================
// CONFIGURATION METADATA FOR EACH OF THE 5 MACHINES
// ============================================================================
interface MachineStationSpec {
  code: string;
  label: string;
  centerX: number;
  readout: string;
}

interface MachineSpec {
  plateLabel: string;
  frontInscription: string;
  carriageLabel: string;
  themeMode: "light-machine" | "dark-machine";
  stations: MachineStationSpec[];
}

const MACHINE_SPECS: Record<string, MachineSpec> = {
  frontend: {
    plateLabel: "VIEWPORT & UI RIG · 12-COL",
    frontInscription: "REACT 19 · NEXT.JS 15 · TAILWIND",
    carriageLabel: "DOM RENDER",
    themeMode: "light-machine",
    stations: [
      { code: "01", label: "WORKSTATION", centerX: 30, readout: "CRT/DOM HYDRATION · 60 FPS" },
      { code: "02", label: "390PX MOBILE", centerX: 54, readout: "MOBILE VIEWPORT · CLS 0.00" },
      { code: "03", label: "768PX TABLET", centerX: 72, readout: "ADAPTIVE GRID · 8PT RHYTHM" },
      { code: "04", label: "1440PX DESKTOP", centerX: 86, readout: "12-COL EDITORIAL · 60 FPS" },
    ],
  },
  backend: {
    plateLabel: "RELATIONAL & RBAC VAULT RIG",
    frontInscription: "LARAVEL MVC · MYSQL · PG RLS",
    carriageLabel: "SQL HEAD",
    themeMode: "light-machine",
    stations: [
      { code: "01", label: "CITIZENS_NIK", centerX: 28, readout: "NIK & KK VALIDATED · 8.4 MS" },
      { code: "02", label: "KK_CENSUS", centerX: 54, readout: "RT/RW AGGREGATION · 11.2 MS" },
      { code: "03", label: "RBAC_ROLES", centerX: 80, readout: "3-ROLE AUTH GATE · 100% RLS" },
    ],
  },
  mobile: {
    plateLabel: "GIMBAL & SENSOR TEST CRADLE",
    frontInscription: "FLUTTER · DART · NATIVE CAMERA",
    carriageLabel: "60FPS PROBE",
    themeMode: "dark-machine",
    stations: [
      { code: "01", label: "CHASSIS & CAM", centerX: 32, readout: "CAMERA LENS STREAM · 1080P" },
      { code: "02", label: "FLUTTER 60FPS", centerX: 64, readout: "FRAME BUDGET · 14.8 MS" },
      { code: "03", label: "TTS & AUDIO", centerX: 84, readout: "VOICE SYNTHESIS · LOW LATENCY" },
    ],
  },
  "ai-cv": {
    plateLabel: "OPTICAL VISION & 21-PT HAND RIG",
    frontInscription: "OPENCV · MEDIAPIPE · SMART HAJJ",
    carriageLabel: "TENSOR SCAN",
    themeMode: "light-machine",
    stations: [
      { code: "01", label: "SAR BANKNOTE", centerX: 32, readout: "100 SAR DETECTED · TTS READY" },
      { code: "02", label: "21-PT PALM", centerX: 62, readout: "HAND LANDMARKS · 21 KEYPOINTS" },
      { code: "03", label: "SIGN 2-WAY", centerX: 84, readout: "SIGN <-> SPEECH · 98.6% CONF" },
    ],
  },
  devops: {
    plateLabel: "CI/CD RELEASE CONVEYOR RIG",
    frontInscription: "GIT · GITHUB ACTIONS · VERCEL",
    carriageLabel: "CI SHUTTLE",
    themeMode: "dark-machine",
    stations: [
      { code: "01", label: "GIT COMMIT", centerX: 26, readout: "@FADLI154 PUSH · SHA VERIFIED" },
      { code: "02", label: "LINT & TYPE", centerX: 46, readout: "TSC --NOEMIT · 0 ERRORS" },
      { code: "03", label: "BUILD & AUDIT", centerX: 66, readout: "SSR + ISR BUNDLE · PASSED" },
      { code: "04", label: "EDGE DEPLOY", centerX: 86, readout: "PRODUCTION LIVE · 99.9% UP" },
    ],
  },
};

const clampCarriage = (x: number) => Math.max(CAR_MIN, Math.min(CAR_MAX, x));
const stationToCarriageX = (centerX: number) => clampCarriage(centerX - CAR_W / 2);

function computePoseForX(x: number) {
  const leftBack: string[] = [];
  const leftFront: string[] = [];
  const rightBack: string[] = [];
  const rightFront: string[] = [];

  for (const y of RAIL_YS) {
    const left = coil(RAIL_FROM + 0.6, x, [y, RAIL_Z], COIL_R, COIL_TURNS, "x", PROJECTION);
    const right = coil(x + CAR_W, RAIL_TO - 0.6, [y, RAIL_Z], COIL_R, COIL_TURNS, "x", PROJECTION);
    leftBack.push(left.back);
    leftFront.push(left.front);
    rightBack.push(right.back);
    rightFront.push(right.front);
  }

  const share = Math.max(0, Math.min(1, (x - CAR_MIN) / (CAR_MAX - CAR_MIN)));
  const angle = -Math.PI * 0.78 + share * Math.PI * 1.56;
  const dialHand = lineOnTop(
    DIAL_C,
    [
      DIAL_C[0] + Math.sin(angle) * (DIAL_R - 2.0),
      DIAL_C[1] - Math.cos(angle) * (DIAL_R - 2.0),
    ],
    DIAL_TOP,
    PROJECTION
  );

  return {
    leftCoil: { back: joinPaths(leftBack), front: joinPaths(leftFront) },
    rightCoil: { back: joinPaths(rightBack), front: joinPaths(rightFront) },
    dialHand,
  };
}

export function KeffiStackFigure({ id }: { id: string }) {
  const spec = MACHINE_SPECS[id] ?? MACHINE_SPECS.frontend!;
  const initialStation = spec.stations[0]!;
  const initialX = stationToCarriageX(initialStation.centerX);
  const initialPose = React.useMemo(() => computePoseForX(initialX), [initialX]);

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [inView, setInView] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef(initialX);
  const posRef = React.useRef<Spring>({ at: initialX, rate: 0 });
  const pressRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ clientX: number; clientY: number; startX: number } | null>(null);
  const userPausedUntilRef = React.useRef<number>(0);

  const carriageGroupRef = React.useRef<SVGGElement>(null);
  const plungerGroupRef = React.useRef<SVGGElement>(null);
  const reticleGroupRef = React.useRef<SVGGElement>(null);
  const leftBackRef = React.useRef<SVGGElement>(null);
  const leftFrontRef = React.useRef<SVGGElement>(null);
  const rightBackRef = React.useRef<SVGGElement>(null);
  const rightFrontRef = React.useRef<SVGGElement>(null);
  const dialHandRef = React.useRef<SVGGElement>(null);

  const setPathD = (ref: React.RefObject<SVGGElement | null>, d: string) => {
    const pathEl = ref.current?.querySelector("path");
    if (pathEl) pathEl.setAttribute("d", d);
  };

  const kick = useLoop((dt, calm) => {
    const settled = draggingRef.current
      ? ((posRef.current.at = follow(posRef.current.at, targetRef.current, dt, 0.025, calm)),
        (posRef.current.rate = 0),
        Math.abs(posRef.current.at - targetRef.current) < 1e-3)
      : spring(posRef.current, targetRef.current, dt, 210, 20, calm);

    const wantPress = draggingRef.current ? 1 : 0;
    pressRef.current = follow(pressRef.current, wantPress, dt, 0.05, calm);

    const x = posRef.current.at;
    const pose = computePoseForX(x);

    setPathD(leftBackRef, pose.leftCoil.back);
    setPathD(leftFrontRef, pose.leftCoil.front);
    setPathD(rightBackRef, pose.rightCoil.back);
    setPathD(rightFrontRef, pose.rightCoil.front);
    setPathD(dialHandRef, pose.dialHand);

    carriageGroupRef.current?.setAttribute(
      "transform",
      `translate(${AXIS_X[0] * x} ${AXIS_X[1] * x})`
    );
    reticleGroupRef.current?.setAttribute(
      "transform",
      `translate(${AXIS_X[0] * targetRef.current} ${AXIS_X[1] * targetRef.current})`
    );

    const zOffset = -PLUNGER_TRAVEL * pressRef.current;
    plungerGroupRef.current?.setAttribute(
      "transform",
      `translate(${AXIS_Z[0] * zOffset} ${AXIS_Z[1] * zOffset})`
    );

    return !settled || pressRef.current !== wantPress;
  }, false);

  // Track viewport visibility for calm idle tour
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Calm idle spring tour when in viewport and not recently touched by user
  React.useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      if (draggingRef.current || Date.now() < userPausedUntilRef.current) return;
      setActiveIdx((prev) => {
        const next = (prev + 1) % spec.stations.length;
        const st = spec.stations[next];
        if (st) {
          targetRef.current = stationToCarriageX(st.centerX);
          kick();
        }
        return next;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [inView, kick, spec.stations]);

  const selectStation = (idx: number) => {
    const st = spec.stations[idx];
    if (!st) return;
    userPausedUntilRef.current = Date.now() + 6000;
    playMechanicalClick(630 + idx * 80);
    setActiveIdx(idx);
    targetRef.current = stationToCarriageX(st.centerX);
    kick();
  };

  const onPointerDown = (event: React.PointerEvent<SVGGElement>) => {
    userPausedUntilRef.current = Date.now() + 8000;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    playMechanicalClick(520);
    grabRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      startX: targetRef.current,
    };
    kick();
  };

  const onPointerMove = (event: React.PointerEvent<SVGGElement>) => {
    const grab = grabRef.current;
    const svg = event.currentTarget.ownerSVGElement;
    if (!grab || !svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (event.clientX - grab.clientX) * (WIDTH / rect.width);
    const dy = (event.clientY - grab.clientY) * (HEIGHT / rect.height);
    const deltaAlongX =
      (dx * AXIS_X[0] + dy * AXIS_X[1]) /
      (AXIS_X[0] * AXIS_X[0] + AXIS_X[1] * AXIS_X[1]);
    targetRef.current = clampCarriage(grab.startX + deltaAlongX);
    kick();
  };

  const onPointerEnd = () => {
    if (!grabRef.current) return;
    grabRef.current = null;
    draggingRef.current = false;
    const mid = targetRef.current + CAR_W / 2;
    let nearestIdx = 0;
    let nearestDist = Infinity;
    spec.stations.forEach((st, idx) => {
      const d = Math.abs(st.centerX - mid);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = idx;
      }
    });
    targetRef.current = stationToCarriageX(spec.stations[nearestIdx]!.centerX);
    setActiveIdx(nearestIdx);
    playMechanicalClick(680);
    kick();
  };

  const currentStation = spec.stations[activeIdx] ?? initialStation;

  return (
    <div
      ref={containerRef}
      className={`svc-anatomy iso ${spec.themeMode}`}
      data-cursor="DRAG / CLICK"
    >
      {/* Pure Transparent Isometric 3D Machine SVG */}
      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label={`Interactive 3D isometric instrument for ${spec.plateLabel}`}
      >
        {/* 1. Shared Heavy Machined Base Plate, Feet, Screws, Groove, Ruler & Stops */}
        <Solid
          paths={baseSolid}
          halo
          inner={
            <>
              <Line d={baseSeam} tone="faint" />
              <Line d={baseInnerLip} tone="faint" />
            </>
          }
        >
          {feetSolids.map((foot, index) => (
            <Solid key={index} paths={foot} tone="lo" />
          ))}
          {cornerScrews.map((screw, index) => (
            <g key={index}>
              <Line d={screw.well} tone="lo" />
              <Line d={screw.slot} tone="mid" />
            </g>
          ))}
          <Dots points={baseDots} size={0.45} tone="lo" />
          <Solid paths={grooveSolid} tone="mid" crease="lo">
            <Line d={grooveInner} tone="faint" />
            {grooveTracks.map((track, index) => (
              <Line key={index} d={track} tone="lo" dashed />
            ))}
          </Solid>
          <Solid paths={rulerSolid} tone="lo" crease="none">
            <Line d={rulerTicks.minor} tone="lo" />
            <Line d={rulerTicks.major} tone="mid" />
          </Solid>
          <Line d={frontScale.minor} tone="faint" />
          <Line d={frontScale.major} tone="lo" />
          <Solid paths={labelPlate} tone="lo" crease="none">
            <Dots points={labelRivets} size={0.45} tone="mid" />
            <FaceText transform={labelTextTf} size={2.1} tone="mid">
              {spec.plateLabel}
            </FaceText>
          </Solid>
          <FaceText transform={frontFaceTf} size={2.1} tone="lo">
            {spec.frontInscription}
          </FaceText>
          <Solid paths={leftStop} tone="mid" />
          <Solid paths={rightStop} tone="mid" />
        </Solid>

        {/* 2. Domain-Specific Rear Deck 3D Hardware Assembly */}
        {id === "frontend" && (
          <g>
            {/* Workstation Monitor + Keycaps + 3 Stepped Responsive Viewport Plates */}
            <Solid paths={feMonitorPlinth} tone="lo" />
            <Solid paths={feMonitorCase} tone="mid" crease="lo">
              <Line d={feMonitorHandle} tone="lo" />
              <Line d={feMonitorScreen} tone="green" />
              <FaceText transform={feMonitorLabelTf} size={1.9} tone="hi">
                WORKSTATION
              </FaceText>
            </Solid>
            {feKeycaps.map((kc, idx) => (
              <Solid key={idx} paths={kc} tone="hi" />
            ))}
            {feViewports.map((vp) => (
              <g key={vp.code}>
                <Wire from={vp.busFrom} to={vp.busTo} tone="green" flow size={0.85} />
                <Solid paths={vp.solid} tone="mid" crease="lo">
                  <Line d={vp.frame} tone="green" />
                  <FaceText transform={vp.labelTf} size={1.75} tone="hi">
                    {vp.code}
                  </FaceText>
                </Solid>
              </g>
            ))}
          </g>
        )}

        {id === "backend" && (
          <g>
            {/* 3 Multi-Tier Cylindrical Relational Storage Silos + Knurled Rims + Spindles */}
            {beDrums.map((drum) => (
              <g key={drum.code}>
                <Wire from={drum.busFrom} to={drum.busTo} tone="green" flow size={0.9} />
                <Solid
                  paths={drum.body}
                  tone="mid"
                  inner={
                    <>
                      <Line d={drum.bodyKnurl} tone="faint" />
                      <Line d={drum.midPlatterRing} tone="lo" />
                    </>
                  }
                >
                  <Line d={drum.outerRing} tone="lo" />
                  <Line d={drum.ticks.minor} tone="lo" />
                  <Line d={drum.ticks.major} tone="mid" />
                  <FaceText transform={drum.labelTf} size={1.85} tone="hi">
                    {drum.code}
                  </FaceText>
                  <Solid paths={drum.innerHub} tone="hi">
                    <Line
                      d={ring(drum.cx, drum.cy, 1.6, TOP_Z + drum.h + 2.8, PROJECTION, 18)}
                      tone="green"
                    />
                  </Solid>
                </Solid>
              </g>
            ))}
          </g>
        )}

        {id === "mobile" && (
          <g>
            {/* Elevated Gimbal-Mounted Smartphone Chassis + Triple Camera Lens Turret + Sensor Towers */}
            <Solid paths={mobCradleLeft} tone="lo" />
            <Solid paths={mobCradleRight} tone="lo" />
            <Solid paths={mobPhoneSlab} tone="mid" crease="lo">
              <Line d={mobScreenBezel} tone="lo" />
              <FaceText transform={mobPhoneLabelTf} size={2.0} tone="hi">
                FLUTTER 60FPS
              </FaceText>
              <Solid
                paths={mobCamTurret}
                tone="hi"
                inner={<Line d={mobCamKnurl} tone="lo" />}
              >
                <Line d={mobCamLens} tone="green" />
              </Solid>
              <Solid paths={mobSubCam} tone="hi" />
            </Solid>
            {mobSensors.map((s) => (
              <g key={s.code}>
                <Wire from={s.busFrom} to={s.busTo} tone="green" flow size={0.9} />
                <Solid paths={s.solid} tone="mid" crease="lo">
                  <FaceText transform={s.labelTf} size={1.8} tone="hi">
                    {s.code}
                  </FaceText>
                  <Solid paths={s.turret} tone="hi" />
                </Solid>
              </g>
            ))}
          </g>
        )}

        {id === "ai-cv" && (
          <g>
            {/* Overhead Optical Vision Gantry Arch + SAR 100 Plate + 21-Joint Articulated Hand Rig */}
            <Solid paths={aiGantryLeftPillar} tone="lo" />
            <Solid paths={aiSarPlate} tone="mid" crease="lo">
              <Line d={aiSarBorder} tone="green" />
              <Line d={aiSarSeal} tone="hi" />
              <FaceText transform={aiSarLabelTf} size={2.1} tone="hi">
                SAR 100 · CV
              </FaceText>
            </Solid>
            <Solid paths={aiGantryRightPillar} tone="lo" />
            <Solid paths={aiGantryBridge} tone="mid" crease="lo">
              <Solid paths={aiGantryLens} tone="hi" />
            </Solid>
            <Line d={aiGantryLaser} tone="green" dashed />
            <Solid paths={aiHandBase} tone="mid" crease="lo">
              <Line d={aiHandBones} tone="green" />
              {aiHandTurrets.map((t, idx) => (
                <Solid key={idx} paths={t} tone="hi" />
              ))}
            </Solid>
          </g>
        )}

        {id !== "frontend" &&
          id !== "backend" &&
          id !== "mobile" &&
          id !== "ai-cv" && (
            <g>
              {/* 4-Stage Automated CI/CD Conveyor Towers */}
              {devopsStations.map((st) => (
                <g key={st.code}>
                  <Wire from={st.busFrom} to={st.busTo} tone="green" flow size={0.9} />
                  <Solid paths={st.tower} tone="mid" crease="lo">
                    <Line d={st.cap} tone="faint" />
                    <FaceText transform={st.labelTf} size={1.75} tone="hi">
                      {st.label}
                    </FaceText>
                    <Solid paths={st.turret} tone="hi">
                      <Line d={st.turretRing} tone="green" />
                    </Solid>
                  </Solid>
                </g>
              ))}
            </g>
          )}

        {/* 3. Target Reticle on Groove Floor */}
        <g
          ref={reticleGroupRef}
          transform={`translate(${AXIS_X[0] * initialX} ${AXIS_X[1] * initialX})`}
        >
          <Line d={reticleRing} tone="green" dashed />
          <Line d={reticleTicks} tone="green" />
          <Line d={reticleStem} tone="green" dotted />
        </g>

        {/* 4. Back Half of Helical Springs */}
        <g ref={leftBackRef}>
          <Line d={initialPose.leftCoil.back} tone="lo" />
        </g>
        <g ref={rightBackRef}>
          <Line d={initialPose.rightCoil.back} tone="lo" />
        </g>

        {/* 5. Dual Guide Rails */}
        <g>
          {railsGeo.map((rail, index) => (
            <g key={index}>
              <Line d={rail.shadow} tone="faint" />
              <Line d={rail.lower} tone="lo" />
              <Line d={rail.upper} tone="hi" />
              <Line d={rail.leftSocket} tone="mid" />
              <Line d={rail.rightSocket} tone="mid" />
            </g>
          ))}
        </g>

        {/* 6. Analog Dial Indicator Gauge + Moving Needle */}
        <g>
          <Wire
            from={dialWireFrom}
            via={[dialWireVia]}
            to={dialWireTo}
            tone="mid"
            flow
            size={1}
          />
          <Solid paths={dialSolid} tone="mid" inner={<Line d={dialKnurl} tone="faint" />}>
            <Line d={dialFace} tone="lo" />
            <Line d={dialInner} tone="faint" dotted />
            <Line d={dialTicks.minor} tone="lo" />
            <Line d={dialTicks.major} tone="mid" />
            <g ref={dialHandRef}>
              <Line d={initialPose.dialHand} tone="green" />
            </g>
            <Dots points={[dialPin]} size={0.9} tone="hi" />
          </Solid>
        </g>

        {/* 7. Interactive Spring-Mounted Lit Carriage + Actuated Plunger */}
        <g
          ref={carriageGroupRef}
          className="rig-carriage-drag"
          transform={`translate(${AXIS_X[0] * initialX} ${AXIS_X[1] * initialX})`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <Solid
            paths={carriageSolid}
            lit
            halo
            inner={<Line d={carriageSeam} tone="lo" />}
          >
            {carriageBushings.map((ringPath, index) => (
              <Line key={index} d={ringPath} tone="mid" />
            ))}
            <Solid paths={carriageWindow} tone="mid" flat>
              <Line d={carriageCross} tone="lo" />
              <Dots points={[carriageCenter]} size={0.95} tone="hi" />
            </Solid>
            <FaceText transform={carriageTextTf} size={2.1} tone="hi">
              {spec.carriageLabel}
            </FaceText>
            <g ref={plungerGroupRef}>
              <Line d={plungerStem} tone="mid" />
              <Solid
                paths={plungerSolid}
                lit
                inner={<Line d={plungerKnurl} tone="lo" />}
              >
                <Line d={plungerCap} tone="mid" />
                <Line d={plungerArrow} tone="green" />
              </Solid>
            </g>
          </Solid>
        </g>

        {/* 8. Front Half of Helical Springs */}
        <g ref={leftFrontRef} className="rig-no-hit">
          <Line d={initialPose.leftCoil.front} tone="mid" />
        </g>
        <g ref={rightFrontRef} className="rig-no-hit">
          <Line d={initialPose.rightCoil.front} tone="mid" />
        </g>
      </IsoFigure>

      {/* Background-Free Interactive Station Pills & Live Telemetry Readout */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-current/15 pt-3 font-mono text-[11px]">
        <div className="flex flex-wrap gap-1.5">
          {spec.stations.map((st, idx) => {
            const active = idx === activeIdx;
            const darkMachine = spec.themeMode === "dark-machine";
            return (
              <button
                key={st.code}
                type="button"
                onClick={() => selectStation(idx)}
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
          {currentStation.readout}
        </span>
      </div>
    </div>
  );
}
