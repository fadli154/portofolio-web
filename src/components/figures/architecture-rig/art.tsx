import { Dots, FaceText, Line, Solid, Wire } from "../../iso/react/draw";
import * as geo from "./geometry";

export function Base() {
  return (
    <Solid
      paths={geo.base}
      halo
      inner={
        <>
          <Line d={geo.baseSeam} tone="faint" />
          <Line d={geo.baseInnerLip} tone="faint" />
        </>
      }
    >
      {geo.feet.map((foot, index) => (
        <Solid key={index} paths={foot} tone="lo" />
      ))}
      {geo.cornerScrews.map((screw, index) => (
        <g key={index}>
          <Line d={screw.well} tone="lo" />
          <Line d={screw.slot} tone="mid" />
        </g>
      ))}
      <Dots points={geo.baseDots} size={0.45} tone="lo" />
      <Solid paths={geo.groove} tone="mid" crease="lo">
        <Line d={geo.grooveInner} tone="faint" />
        {geo.grooveTracks.map((track, index) => (
          <Line key={index} d={track} tone="lo" dashed />
        ))}
      </Solid>
      <Solid paths={geo.ruler} tone="lo" crease="none">
        <Line d={geo.rulerTicks.minor} tone="lo" />
        <Line d={geo.rulerTicks.major} tone="mid" />
      </Solid>
      <Line d={geo.frontScale.minor} tone="faint" />
      <Line d={geo.frontScale.major} tone="lo" />
      <Solid paths={geo.labelPlate} tone="lo" crease="none">
        <Dots points={geo.labelRivets} size={0.45} tone="mid" />
        <FaceText transform={geo.labelTextTf} size={2.2} tone="mid">
          FADLI FULL-STACK &amp; AI RIG
        </FaceText>
      </Solid>
      <FaceText transform={geo.frontFaceTf} size={2.2} tone="lo">
        WEB · GOVTECH · SQL · VISION AI
      </FaceText>
      <Solid paths={geo.leftStop} tone="mid" />
      <Solid paths={geo.rightStop} tone="mid" />
    </Solid>
  );
}

export function Stations() {
  return (
    <g>
      {geo.stationSolids.map((st) => (
        <g key={st.id} data-station-id={st.id}>
          <Wire from={st.busFrom} to={st.busTo} tone="green" flow size={0.9} />
          <Solid paths={st.tower} tone="mid" crease="lo">
            <Line d={st.cap} tone="faint" />
            <FaceText transform={st.labelTf} size={1.85} tone="hi">
              {st.label}
            </FaceText>
            <FaceText transform={st.codeTf} size={2.1} tone="mid">
              {st.code}
            </FaceText>
            <Solid paths={st.turret} tone="hi">
              <Line d={st.turretRing} tone="green" />
            </Solid>
          </Solid>
        </g>
      ))}
    </g>
  );
}

export function Rails() {
  return (
    <g>
      {geo.rails.map((rail, index) => (
        <g key={index}>
          <Line d={rail.shadow} tone="faint" />
          <Line d={rail.lower} tone="lo" />
          <Line d={rail.upper} tone="hi" />
          <Line d={rail.leftSocket} tone="mid" />
          <Line d={rail.rightSocket} tone="mid" />
        </g>
      ))}
    </g>
  );
}

export function Dial({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <Wire
        from={geo.dialWireFrom}
        via={[geo.dialWireVia]}
        to={geo.dialWireTo}
        tone="mid"
        flow
        size={1}
      />
      <Solid paths={geo.dial} tone="mid" inner={<Line d={geo.dialKnurl} tone="faint" />}>
        <Line d={geo.dialFace} tone="lo" />
        <Line d={geo.dialInner} tone="faint" dotted />
        <Line d={geo.dialTicks.minor} tone="lo" />
        <Line d={geo.dialTicks.major} tone="mid" />
        {children}
        <Dots points={[geo.dialPin]} size={0.9} tone="hi" />
      </Solid>
    </g>
  );
}

export function Carriage({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <Solid paths={geo.carriage} lit halo inner={<Line d={geo.carriageSeam} tone="lo" />}>
        {geo.carriageBushings.map((ringPath, index) => (
          <Line key={index} d={ringPath} tone="mid" />
        ))}
        <Solid paths={geo.carriageWindow} tone="mid" flat>
          <Line d={geo.carriageCross} tone="lo" />
          <Dots points={[geo.carriageCenter]} size={0.95} tone="hi" />
        </Solid>
        <FaceText transform={geo.carriageTextTf} size={2.2} tone="hi">
          REQ PACKET
        </FaceText>
        {children}
      </Solid>
    </g>
  );
}

export function Plunger() {
  return (
    <g>
      <Line d={geo.plungerStem} tone="mid" />
      <Solid
        paths={geo.plunger}
        lit
        inner={<Line d={geo.plungerKnurl} tone="lo" />}
      >
        <Line d={geo.plungerCap} tone="mid" />
        <Line d={geo.plungerArrow} tone="green" />
      </Solid>
    </g>
  );
}

export function TargetReticle() {
  return (
    <g>
      <Line d={geo.reticleRing} tone="green" dashed />
      <Line d={geo.reticleTicks} tone="green" />
      <Line d={geo.reticleStem} tone="green" dotted />
    </g>
  );
}

