import type { Plane, Plan } from "../../iso/iso-kit";

export const BASE: Plan = { x: 0, y: 0, w: 120, d: 68, r: 8 };
export const BASE_Z = 0;
export const BASE_H = 7.5;
export const TOP_Z = BASE_Z + BASE_H;

export const GROOVE: Plan = { x: 14, y: 26, w: 92, d: 22, r: 3.5 };
export const GROOVE_H = 1.6;
export const GROOVE_Z = TOP_Z;

export const RULER: Plan = { x: 14, y: 51, w: 92, d: 5.5, r: 1.5 };
export const RULER_H = 0.8;

export const RAIL_FROM = 18;
export const RAIL_TO = 102;
export const RAIL_YS = [32, 42] as const;
export const RAIL_Z = GROOVE_Z + GROOVE_H + 3.2;

export const STOP_W = 5.5;
export const STOP_D = 18;
export const STOP_H = 9.5;
export const LEFT_STOP: Plan = { x: RAIL_FROM - STOP_W, y: 28, w: STOP_W, d: STOP_D, r: 1.8 };
export const RIGHT_STOP: Plan = { x: RAIL_TO, y: 28, w: STOP_W, d: STOP_D, r: 1.8 };

export const CAR_W = 16;
export const CAR_D = 18;
export const CAR_H = 8.5;
export const CAR_Z = GROOVE_Z + GROOVE_H + 0.8;
export const CAR_MIN = RAIL_FROM + 2;
export const CAR_MAX = RAIL_TO - CAR_W - 2;
export const CAR_REST = CAR_MIN + (CAR_MAX - CAR_MIN) * 0.66;

export const COIL_R = 2.1;
export const COIL_TURNS = 7;

export const DIAL_C: Plane = [104, 13.5];
export const DIAL_R = 9.5;
export const DIAL_H = 3.2;
export const DIAL_TOP = TOP_Z + DIAL_H;

export const PLUNGER_R = 4.4;
export const PLUNGER_H = 5.2;
export const PLUNGER_TRAVEL = 3.2;

export interface PipelineStation {
  id: string;
  code: string;
  label: string;
  shortTitle: string;
  latencyMs: number;
  statusText: string;
  detailEn: string;
  detailId: string;
  centerX: number;
  plan: Plan;
  height: number;
}

export const STATIONS: PipelineStation[] = [
  {
    id: "frontend-mobile",
    code: "01",
    label: "WEB & MOBILE",
    shortTitle: "React, Next.js & Flutter UI",
    latencyMs: 4.8,
    statusText: "UI / UX · CROSS-PLATFORM",
    detailEn: "Responsive web interfaces (React, Next.js, Tailwind) and cross-platform mobile apps (Flutter, Dart) with real-time camera & audio sensors.",
    detailId: "Antarmuka web responsif (React, Next.js, Tailwind) serta aplikasi mobile lintas platform (Flutter, Dart) dengan integrasi kamera dan sensor real-time.",
    centerX: 25,
    plan: { x: 18, y: 6, w: 15, d: 14, r: 2.2 },
    height: 6.5,
  },
  {
    id: "govtech-backend",
    code: "02",
    label: "LARAVEL API",
    shortTitle: "GovTech & SIMDUK Backend",
    latencyMs: 11.4,
    statusText: "MVC · RBAC AUTH · REST API",
    detailEn: "Server architecture powering SIMDUK Dinas Kominfo and public-sector portals with NIK/KK validation and multi-role access control (RBAC).",
    detailId: "Arsitektur server untuk SIMDUK Dinas Kominfo dan portal instansi publik dengan validasi NIK/KK serta hak akses berjenjang (RBAC).",
    centerX: 46,
    plan: { x: 38.5, y: 6, w: 15, d: 14, r: 2.2 },
    height: 8.2,
  },
  {
    id: "database-rls",
    code: "03",
    label: "SQL & SUPABASE",
    shortTitle: "MySQL, PostgreSQL & RLS",
    latencyMs: 16.2,
    statusText: "RELATIONAL · CENSUS & CMS",
    detailEn: "Normalized relational schemas in MySQL and Supabase PostgreSQL handling RT/RW demographic recaps, dynamic coursework logs, and 100% RLS.",
    detailId: "Skema database relasional MySQL dan Supabase PostgreSQL untuk rekapitulasi sensus RT/RW, log perkuliahan dinamis, serta proteksi RLS.",
    centerX: 67,
    plan: { x: 59, y: 6, w: 16, d: 14, r: 2.2 },
    height: 10.0,
  },
  {
    id: "vision-ai",
    code: "04",
    label: "VISION AI",
    shortTitle: "OpenCV & MediaPipe 21-Pt",
    latencyMs: 22.5,
    statusText: "SAR DETECTOR · SIGN AI",
    detailEn: "Computer Vision pipeline for Smart Hajj: real-time Saudi Riyal (SAR) banknote recognition with TTS and 21-point hand landmark sign translation.",
    detailId: "Pipeline Computer Vision Smart Hajj: deteksi pecahan uang Riyal (SAR) dengan suara TTS otomatis dan pelacakan 21 titik tangan bahasa isyarat.",
    centerX: 86,
    plan: { x: 79, y: 6, w: 15, d: 14, r: 2.2 },
    height: 7.4,
  },
];

