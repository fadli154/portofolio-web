import {
  corners,
  cylinder,
  dotGrid,
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
} from "../../iso/iso-kit";
import {
  BASE,
  BASE_H,
  BASE_Z,
  CAR_D,
  CAR_H,
  CAR_W,
  CAR_Z,
  DIAL_C,
  DIAL_H,
  DIAL_R,
  DIAL_TOP,
  GROOVE,
  GROOVE_H,
  GROOVE_Z,
  LEFT_STOP,
  PLUNGER_H,
  PLUNGER_R,
  RAIL_FROM,
  RAIL_TO,
  RAIL_YS,
  RAIL_Z,
  RIGHT_STOP,
  RULER,
  RULER_H,
  STATIONS,
  STOP_H,
  TOP_Z,
} from "./rig";
import { PROJECTION } from "./view";

export const base = slabOf(BASE, BASE_Z, BASE_H, PROJECTION, 8, 0.85);
export const baseSeam = sideSeam(BASE, BASE_Z + 2.0, PROJECTION);
export const baseInnerLip = planOutline(insetPlan(BASE, 3.0), TOP_Z, PROJECTION);

export const feet = corners(BASE, 9).map(([cx, cy]) =>
  cylinder(cx, cy, 4.6, BASE_Z - 2.6, 2.6, PROJECTION, 24)
);

export const cornerScrews = corners(BASE, 6.2).map(([cx, cy]) => ({
  well: ring(cx, cy, 2.0, TOP_Z, PROJECTION, 20),
  slot: joinPaths([
    lineOnTop([cx - 1.0, cy], [cx + 1.0, cy], TOP_Z, PROJECTION),
    lineOnTop([cx, cy - 1.0], [cx, cy + 1.0], TOP_Z, PROJECTION),
  ]),
}));

export const baseDots = dotGrid(14, 59, 23, 2, 4, TOP_Z, PROJECTION);

export const groove = slabOf(GROOVE, GROOVE_Z, GROOVE_H, PROJECTION, 6);
export const grooveInner = planOutline(insetPlan(GROOVE, 1.8), GROOVE_Z + GROOVE_H, PROJECTION);
export const grooveTracks = RAIL_YS.map((y) =>
  lineOnTop([RAIL_FROM, y], [RAIL_TO, y], GROOVE_Z + GROOVE_H, PROJECTION)
);

export const ruler = slabOf(RULER, TOP_Z, RULER_H, PROJECTION, 4);
export const rulerTicks = topTicks(
  18,
  102,
  1.5,
  4,
  RULER.y,
  TOP_Z + RULER_H,
  [1.8, 3.6],
  PROJECTION
);
export const frontScale = sideTicks(18, 102, 2, 5, BASE.d, TOP_Z - 1.0, [1.2, 2.4], PROJECTION);

const LABEL_PLAN: Plan = { x: 16, y: 58.5, w: 46, d: 6.5, r: 1.4 };
export const labelPlate = slabOf(LABEL_PLAN, TOP_Z, 0.65, PROJECTION, 4);
export const labelRivets = [
  iso([LABEL_PLAN.x + 2.2, LABEL_PLAN.y + LABEL_PLAN.d / 2, TOP_Z + 0.65], PROJECTION),
  iso([LABEL_PLAN.x + LABEL_PLAN.w - 2.2, LABEL_PLAN.y + LABEL_PLAN.d / 2, TOP_Z + 0.65], PROJECTION),
];
export const labelTextTf = topMatrix(
  [LABEL_PLAN.x + 4.8, LABEL_PLAN.y + 4.4],
  TOP_Z + 0.65,
  PROJECTION
);
export const frontFaceTf = sideMatrix([16, BASE.d], TOP_Z - 3.6, PROJECTION, "left");

export const leftStop = slabOf(LEFT_STOP, TOP_Z, STOP_H, PROJECTION, 5, 0.45);
export const rightStop = slabOf(RIGHT_STOP, TOP_Z, STOP_H, PROJECTION, 5, 0.45);

export const rails = RAIL_YS.map((y) => ({
  upper: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], RAIL_Z + 0.45, PROJECTION),
  lower: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], RAIL_Z - 0.45, PROJECTION),
  shadow: lineOnTop([RAIL_FROM, y], [RAIL_TO, y], GROOVE_Z + GROOVE_H, PROJECTION),
  leftSocket: sideRing([RAIL_FROM, y, RAIL_Z], 1.35, "x", PROJECTION),
  rightSocket: sideRing([RAIL_TO, y, RAIL_Z], 1.35, "x", PROJECTION),
}));

export const stationSolids = STATIONS.map((st) => {
  const tower = slabOf(st.plan, TOP_Z, st.height, PROJECTION, 6, 0.45);
  const topZ = TOP_Z + st.height;
  const cap = planOutline(insetPlan(st.plan, 1.8), topZ, PROJECTION);
  const coreX = st.plan.x + st.plan.w / 2;
  const coreY = st.plan.y + st.plan.d / 2;
  const turret = cylinder(coreX, coreY, 3.0, topZ, 1.8, PROJECTION, 24);
  const turretRing = ring(coreX, coreY, 1.6, topZ + 1.8, PROJECTION, 20);
  const labelTf = topMatrix([st.plan.x + 2.2, st.plan.y + st.plan.d - 2.4], topZ, PROJECTION);
  const codeTf = sideMatrix([st.plan.x + 2.2, st.plan.y + st.plan.d], topZ - 2.2, PROJECTION, "left");
  const busFrom = iso([coreX, st.plan.y + st.plan.d, TOP_Z + 0.8], PROJECTION);
  const busTo = iso([coreX, GROOVE.y, TOP_Z + 0.8], PROJECTION);
  return {
    id: st.id,
    code: st.code,
    label: st.label,
    tower,
    cap,
    turret,
    turretRing,
    labelTf,
    codeTf,
    busFrom,
    busTo,
  };
});

export const dial = cylinder(DIAL_C[0], DIAL_C[1], DIAL_R, TOP_Z, DIAL_H, PROJECTION, 36, 0.45);
export const dialKnurl = knurl(DIAL_C[0], DIAL_C[1], DIAL_R, TOP_Z, DIAL_TOP, 32, PROJECTION, 0.5);
export const dialFace = ring(DIAL_C[0], DIAL_C[1], DIAL_R - 1.3, DIAL_TOP, PROJECTION, 36);
export const dialInner = ring(DIAL_C[0], DIAL_C[1], DIAL_R - 3.6, DIAL_TOP, PROJECTION, 28);
export const dialTicks = radialTicks(
  DIAL_C[0],
  DIAL_C[1],
  DIAL_R - 1.6,
  24,
  4,
  DIAL_TOP,
  [1.1, 2.3],
  PROJECTION
);
export const dialPin = iso([DIAL_C[0], DIAL_C[1], DIAL_TOP], PROJECTION);
export const dialWireFrom = iso([DIAL_C[0] - DIAL_R, DIAL_C[1], TOP_Z + 1.0], PROJECTION);
export const dialWireVia = iso([94, DIAL_C[1], TOP_Z + 1.0], PROJECTION);
export const dialWireTo = iso([94, GROOVE.y, TOP_Z + 1.0], PROJECTION);

const CAR_ORIGIN: Plan = { x: 0, y: 28, w: CAR_W, d: CAR_D, r: 2.2 };
const CAR_TOP = CAR_Z + CAR_H;
const WIN_PLAN = insetPlan(CAR_ORIGIN, 2.8);

export const carriage = slabOf(CAR_ORIGIN, CAR_Z, CAR_H, PROJECTION, 6, 0.55);
export const carriageSeam = sideSeam(CAR_ORIGIN, CAR_Z + 2.4, PROJECTION);
export const carriageWindow = slabOf(WIN_PLAN, CAR_TOP - 1.1, 1.1, PROJECTION, 4);
export const carriageCross = joinPaths([
  lineOnTop([CAR_W / 2, WIN_PLAN.y + 1.2], [CAR_W / 2, WIN_PLAN.y + WIN_PLAN.d - 1.2], CAR_TOP, PROJECTION),
  lineOnTop([WIN_PLAN.x + 1.2, 28 + CAR_D / 2], [WIN_PLAN.x + WIN_PLAN.w - 1.2, 28 + CAR_D / 2], CAR_TOP, PROJECTION),
]);
export const carriageCenter = iso([CAR_W / 2, 28 + CAR_D / 2, CAR_TOP], PROJECTION);
export const carriageBushings = RAIL_YS.flatMap((y) => [
  sideRing([0, y, RAIL_Z], 1.75, "x", PROJECTION),
  sideRing([CAR_W, y, RAIL_Z], 1.75, "x", PROJECTION),
]);
export const carriageTextTf = sideMatrix([2.2, 28 + CAR_D], CAR_TOP - 2.6, PROJECTION, "left");

const PLUNGER_C: [number, number] = [CAR_W / 2, 28 + CAR_D / 2];
const PLUNGER_Z = CAR_TOP + 2.4;
const PLUNGER_TOP = PLUNGER_Z + PLUNGER_H;

export const plungerStem = rise(PLUNGER_C, CAR_TOP, PLUNGER_Z, PROJECTION);
export const plunger = cylinder(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R, PLUNGER_Z, PLUNGER_H, PROJECTION, 28, 0.35);
export const plungerKnurl = knurl(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R, PLUNGER_Z, PLUNGER_TOP, 22, PROJECTION, 0.45);
export const plungerCap = ring(PLUNGER_C[0], PLUNGER_C[1], PLUNGER_R - 1.2, PLUNGER_TOP, PROJECTION, 24);
export const plungerArrow = joinPaths([
  lineOnTop([PLUNGER_C[0] - 1.8, PLUNGER_C[1]], [PLUNGER_C[0] + 1.8, PLUNGER_C[1]], PLUNGER_TOP, PROJECTION),
  lineOnTop([PLUNGER_C[0] + 0.6, PLUNGER_C[1] - 1.2], [PLUNGER_C[0] + 1.8, PLUNGER_C[1]], PLUNUNGER_TOP_SAFE(PLUNGER_TOP), PROJECTION),
  lineOnTop([PLUNGER_C[0] + 0.6, PLUNGER_C[1] + 1.2], [PLUNGER_C[0] + 1.8, PLUNGER_C[1]], PLUNUNGER_TOP_SAFE(PLUNGER_TOP), PROJECTION),
]);

function PLUNUNGER_TOP_SAFE(z: number) {
  return z;
}

export const reticleRing = ring(CAR_W / 2, 28 + CAR_D / 2, 3.0, GROOVE_Z + GROOVE_H, PROJECTION, 24);
export const reticleTicks = radialTicks(
  CAR_W / 2,
  28 + CAR_D / 2,
  4.4,
  4,
  1,
  GROOVE_Z + GROOVE_H,
  [1.5, 1.5],
  PROJECTION
).major;
export const reticleStem = rise([CAR_W / 2, 28 + CAR_D / 2], GROOVE_Z + GROOVE_H, CAR_Z, PROJECTION);

