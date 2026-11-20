import { CSSProperties, FC } from "react";

export interface DitherVeilProps {
  src?: string;
  fit?: "cover" | "contain";
  pattern?: "floyd" | "atkinson" | "bayer" | "noise" | "lines";
  pixelSize?: number;
  levels?: number;
  palette?: "duotone" | "rgb";
  inkColor?: string;
  paperColor?: string;
  contrast?: number;
  brightness?: number;
  revealRadius?: number;
  softness?: number;
  linger?: number;
  rimColor?: string;
  rim?: number;
  reverse?: boolean;
  wander?: boolean;
  clickBurst?: boolean;
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const DitherVeil: FC<DitherVeilProps>;
export default DitherVeil;
