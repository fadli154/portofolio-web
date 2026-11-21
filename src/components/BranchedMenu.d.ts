import React from "react";

export interface BranchedMenuItemChild {
  value: string;
  label: React.ReactNode | string;
  icon?: any;
}

export interface BranchedMenuItem {
  label: React.ReactNode | string;
  value?: string;
  children?: BranchedMenuItemChild[];
}

export interface BranchedMenuProps {
  items?: BranchedMenuItem[];
  defaultOpen?: number | number[] | "all";
  defaultActive?: string;
  active?: string;
  onSelect?: (value: string, item: BranchedMenuItemChild | BranchedMenuItem) => void;
  onToggle?: (index: number, isOpen: boolean) => void;
  color?: string;
  accentColor?: string;
  lineColor?: string;
  width?: number;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
}

declare const BranchedMenu: React.FC<BranchedMenuProps>;
export default BranchedMenu;
