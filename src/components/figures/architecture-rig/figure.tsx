import "../../iso/iso.css";
import "./rig.css";
import { Plate } from "../../iso/react/draw";
import { CAR_REST } from "./rig";
import { computeRigPose } from "./pose";
import {
  Base,
  Carriage,
  Dial,
  Plunger,
  Rails,
  Stations,
  TargetReticle,
} from "./art";
import { ArchitectureRigLive } from "./live";

const initialPose = computeRigPose(CAR_REST);

export function ArchitectureRigFigure() {
  return (
    <Plate
      fig="ANATOMY · 01"
      title="INTERACTIVE SYSTEM ARCHITECTURE RIG"
      hint="DRAG CARRIAGE · CLICK STATIONS 01-04 · SPACE TO SIMULATE"
      readout={initialPose.readout}
      keys={[
        { mark: "lit", label: "Active request / data carriage" },
        { mark: "green", label: "Live telemetry & RLS bus" },
        { mark: "dashed", label: "Spring guide track" },
      ]}
      caption="Interactive isometric physical mechanism mapping Fadli Hifziansyah's engineering workflow across Web/Mobile UI, Laravel GovTech APIs, MySQL/Supabase PostgreSQL, and OpenCV/MediaPipe Vision AI."
    >
      <ArchitectureRigLive
        base={<Base key="base" />}
        stations={<Stations key="stations" />}
        rails={<Rails key="rails" />}
        dial={<Dial key="dial" />}
        carriage={<Carriage key="carriage" />}
        plunger={<Plunger key="plunger" />}
        reticle={<TargetReticle key="reticle" />}
      />
    </Plate>
  );
}

