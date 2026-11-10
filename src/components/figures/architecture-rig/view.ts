import { axisVector, boxCorners, fitProjection } from "../../iso/iso-kit";
import { BASE, BASE_Z, CAR_Z, PLUNGER_H, CAR_H, TOP_Z } from "./rig";

export const WIDTH = 680;
export const HEIGHT = 390;

export const PROJECTION = fitProjection(
  boxCorners(BASE, BASE_Z - 3.5, CAR_Z + CAR_H + PLUNGER_H + 8),
  WIDTH,
  HEIGHT,
  { pad: 34, headroom: 10 }
);

export const AXIS_X = axisVector(PROJECTION, [1, 0, 0]);
export const AXIS_Z = axisVector(PROJECTION, [0, 0, 1]);
export const TOP_SURFACE = TOP_Z;

