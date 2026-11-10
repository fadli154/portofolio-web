import { coil, joinPaths, lineOnTop } from "../../iso/iso-kit";
import {
  CAR_MAX,
  CAR_MIN,
  CAR_W,
  COIL_R,
  COIL_TURNS,
  DIAL_C,
  DIAL_R,
  DIAL_TOP,
  RAIL_FROM,
  RAIL_TO,
  RAIL_YS,
  RAIL_Z,
  STATIONS,
} from "./rig";
import { PROJECTION } from "./view";

export interface RigPose {
  leftCoil: { back: string; front: string };
  rightCoil: { back: string; front: string };
  dialHand: string;
  activeStationIndex: number;
  latencyMs: number;
  readout: string;
}

export function computeRigPose(x: number): RigPose {
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
      DIAL_C[0] + Math.sin(angle) * (DIAL_R - 2.1),
      DIAL_C[1] - Math.cos(angle) * (DIAL_R - 2.1),
    ],
    DIAL_TOP,
    PROJECTION
  );

  const carriageMid = x + CAR_W / 2;
  let closestIdx = 0;
  let bestDist = Infinity;
  STATIONS.forEach((st, idx) => {
    const dist = Math.abs(st.centerX - carriageMid);
    if (dist < bestDist) {
      bestDist = dist;
      closestIdx = idx;
    }
  });

  const activeStation = STATIONS[closestIdx]!;
  const interpolatedLatency = 4.2 + share * 22.7;

  return {
    leftCoil: { back: joinPaths(leftBack), front: joinPaths(leftFront) },
    rightCoil: { back: joinPaths(rightBack), front: joinPaths(rightFront) },
    dialHand,
    activeStationIndex: closestIdx,
    latencyMs: interpolatedLatency,
    readout: `STAGE ${activeStation.code}/04 · ${activeStation.label} · ${interpolatedLatency.toFixed(1)} ms`,
  };
}

