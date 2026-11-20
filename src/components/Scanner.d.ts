import React, { CSSProperties } from 'react';

export interface ScannerProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  trail?: number;
  reverse?: boolean;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineWidth?: number;
  glow?: number;
  scanDirection?: 'vertical' | 'horizontal' | 'diagonal';
  colorSpread?: number;
  brightness?: number;
  vignette?: number;
  scanline?: boolean;
  scanlineIntensity?: number;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
  mouseMode?: 'repel' | 'attract';
  clickEffect?: 'ping';
  intro?: boolean;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Scanner: React.FC<ScannerProps>;
export default Scanner;
