import React from "react";

export interface MagicBentoItem {
  id?: string | number;
  title?: string;
  description?: string;
  label?: string;
  icon?: React.ReactNode;
  visual?: string | React.ReactNode;
  content?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  image?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event?: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export interface MagicBentoProps {
  items?: MagicBentoItem[];
  theme?: "dark" | "light" | "mint" | "homepage";
  preset?: "mint" | "homepage" | "default" | string;
  columns?: number;
  rowHeight?: number;
  gap?: number;
  radius?: number;
  glowColor?: string;
  textAutoHide?: boolean;
  enableBorderGlow?: boolean;
  enableSpotlight?: boolean;
  spotlightRadius?: number;
  enableStars?: boolean;
  particleCount?: number;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  intro?: boolean;
  disableAnimations?: boolean;
  onItemClick?: (item: MagicBentoItem, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

declare const MagicBento: React.FC<MagicBentoProps>;
export default MagicBento;
