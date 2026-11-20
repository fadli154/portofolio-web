import React, { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type FadeContentEffect = 'fade' | 'focus' | 'develop' | 'dissolve' | 'mist' | 'pixel';
export type FadeContentStaggerFrom = 'start' | 'end' | 'center' | 'edges' | 'random';

export interface FadeContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  container?: Element | string | null;
  effect?: FadeContentEffect;
  blur?: boolean | number;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  stagger?: number;
  staggerFrom?: FadeContentStaggerFrom;
  trigger?: 'scroll' | 'mount';
  once?: boolean;
  exit?: boolean;
  scrub?: boolean | number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}

declare const FadeContent: React.FC<FadeContentProps>;
export default FadeContent;
