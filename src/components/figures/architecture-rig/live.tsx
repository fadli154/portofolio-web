"use client";

import * as React from "react";
import { IsoFigure, Line } from "../../iso/react/draw";
import { follow, spring, useLoop, useReadout, type Spring } from "../../iso/react/live";
import {
  CAR_MAX,
  CAR_MIN,
  CAR_REST,
  CAR_W,
  PLUNGER_TRAVEL,
  STATIONS,
} from "./rig";
import { computeRigPose } from "./pose";
import { AXIS_X, AXIS_Z, HEIGHT, WIDTH } from "./view";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { usePortfolioState } from "@/lib/i18n/context";

const clampCarriage = (x: number) => Math.max(CAR_MIN, Math.min(CAR_MAX, x));
const stationToCarriageX = (centerX: number) => clampCarriage(centerX - CAR_W / 2);

const initialPose = computeRigPose(CAR_REST);

interface ArchitectureRigLiveProps {
  base: React.ReactNode;
  stations: React.ReactNode;
  rails: React.ReactNode;
  dial: React.ReactNode;
  carriage: React.ReactNode;
  plunger: React.ReactNode;
  reticle: React.ReactNode;
}

export function ArchitectureRigLive({
  base,
  stations,
  rails,
  dial,
  carriage,
  plunger,
  reticle,
}: ArchitectureRigLiveProps) {
  const { locale } = usePortfolioState();
  const { anchor, say } = useReadout<SVGGElement>();

  const targetRef = React.useRef(CAR_REST);
  const posRef = React.useRef<Spring>({ at: CAR_REST, rate: 0 });
  const pressRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const grabRef = React.useRef<{ clientX: number; clientY: number; startX: number } | null>(null);
  const autoStepTimerRef = React.useRef<number | null>(null);

  const [activeStationIdx, setActiveStationIdx] = React.useState(2);
  const [isSimulating, setIsSimulating] = React.useState(false);

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
      : spring(posRef.current, targetRef.current, dt, 220, 21, calm);

    const wantPress = draggingRef.current ? 1 : 0;
    pressRef.current = follow(pressRef.current, wantPress, dt, 0.05, calm);

    const x = posRef.current.at;
    const pose = computeRigPose(x);

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

    say(pose.readout);
    if (pose.activeStationIndex !== activeStationIdx) {
      setActiveStationIdx(pose.activeStationIndex);
    }

    return !settled || pressRef.current !== wantPress;
  }, false);

  const stopAutoSim = React.useCallback(() => {
    if (autoStepTimerRef.current) {
      window.clearInterval(autoStepTimerRef.current);
      autoStepTimerRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  React.useEffect(() => () => stopAutoSim(), [stopAutoSim]);

  const jumpToStation = (idx: number) => {
    stopAutoSim();
    const station = STATIONS[idx];
    if (!station) return;
    playMechanicalClick(620 + idx * 90);
    targetRef.current = stationToCarriageX(station.centerX);
    setActiveStationIdx(idx);
    kick();
  };

  const triggerRequestSimulation = () => {
    if (isSimulating) {
      stopAutoSim();
      return;
    }
    playMechanicalClick(740);
    setIsSimulating(true);
    let step = 0;
    targetRef.current = stationToCarriageX(STATIONS[0]!.centerX);
    setActiveStationIdx(0);
    kick();

    autoStepTimerRef.current = window.setInterval(() => {
      step += 1;
      if (step >= STATIONS.length) {
        stopAutoSim();
        return;
      }
      playMechanicalClick(620 + step * 95);
      targetRef.current = stationToCarriageX(STATIONS[step]!.centerX);
      setActiveStationIdx(step);
      kick();
    }, 950);
  };

  const onPointerDown = (event: React.PointerEvent<SVGGElement>) => {
    stopAutoSim();
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
    // Snap to nearest station on release for crisp mechanical detents
    const mid = targetRef.current + CAR_W / 2;
    let nearestIdx = 0;
    let nearestDist = Infinity;
    STATIONS.forEach((st, idx) => {
      const d = Math.abs(st.centerX - mid);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = idx;
      }
    });
    targetRef.current = stationToCarriageX(STATIONS[nearestIdx]!.centerX);
    setActiveStationIdx(nearestIdx);
    playMechanicalClick(680);
    kick();
  };

  const onKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      jumpToStation(Math.max(0, activeStationIdx - 1));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      jumpToStation(Math.min(STATIONS.length - 1, activeStationIdx + 1));
    } else if (event.key === " ") {
      event.preventDefault();
      triggerRequestSimulation();
    }
  };

  const currentStation = STATIONS[activeStationIdx] ?? STATIONS[2]!;

  return (
    <div className="rig-shell">
      <div className="rig-toolbar" role="toolbar" aria-label="Pipeline telemetry controls">
        <div className="rig-station-pills">
          {STATIONS.map((st, idx) => {
            const isActive = idx === activeStationIdx;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => jumpToStation(idx)}
                className={`rig-pill ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
              >
                <span className="rig-pill-code">{st.code}</span>
                <span className="rig-pill-label">{st.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={triggerRequestSimulation}
          className="rig-sim-btn"
          data-fill=""
        >
          <span className="rig-sim-dot" data-simulating={isSimulating ? "true" : undefined} />
          <span>
            {isSimulating
              ? locale === "id"
                ? "Mengalirkan Paket..."
                : "Streaming Packet..."
              : locale === "id"
                ? "Simulasikan Request"
                : "Simulate Request"}
          </span>
        </button>
      </div>

      <IsoFigure
        width={WIDTH}
        height={HEIGHT}
        label="Interactive isometric bench instrument showing request flow from Client Edge through Next.js ISR, Supabase PostgreSQL RLS, and AI Agent Worker"
      >
        <g ref={anchor} />
        {base}
        {stations}
        <g
          ref={reticleGroupRef}
          transform={`translate(${AXIS_X[0] * CAR_REST} ${AXIS_X[1] * CAR_REST})`}
        >
          {reticle}
        </g>
        <g ref={leftBackRef}>
          <Line d={initialPose.leftCoil.back} tone="lo" />
        </g>
        <g ref={rightBackRef}>
          <Line d={initialPose.rightCoil.back} tone="lo" />
        </g>
        {rails}
        {dial}
        <g ref={dialHandRef}>
          <Line d={initialPose.dialHand} tone="green" />
        </g>
        <g
          ref={carriageGroupRef}
          className="rig-carriage-drag"
          transform={`translate(${AXIS_X[0] * CAR_REST} ${AXIS_X[1] * CAR_REST})`}
          tabIndex={0}
          role="slider"
          aria-label="Request packet stage selector"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={activeStationIdx + 1}
          aria-valuetext={`${currentStation.code} ${currentStation.shortTitle}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
        >
          {carriage}
          <g ref={plungerGroupRef}>{plunger}</g>
        </g>
        <g ref={leftFrontRef} className="rig-no-hit">
          <Line d={initialPose.leftCoil.front} tone="mid" />
        </g>
        <g ref={rightFrontRef} className="rig-no-hit">
          <Line d={initialPose.rightCoil.front} tone="mid" />
        </g>
      </IsoFigure>

      <div className="rig-inspector" aria-live="polite">
        <div className="rig-inspector-meta">
          <span className="rig-inspector-badge">
            STAGE {currentStation.code} / 04
          </span>
          <strong className="rig-inspector-title">{currentStation.shortTitle}</strong>
          <span className="rig-inspector-status">{currentStation.statusText}</span>
        </div>
        <p className="rig-inspector-desc">
          {locale === "id" ? currentStation.detailId : currentStation.detailEn}
        </p>
      </div>
    </div>
  );
}

