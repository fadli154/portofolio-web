'use client';

import React from 'react';
import { CurvedLoop, CurvedLoopProps } from './CurvedLoop';

export type TextLoopProps = CurvedLoopProps;

/**
 * TextLoop component from React Bits (https://reactbits.dev/text-animations/text-loop)
 * Renders an animated kinetic typography ribbon / marquee that flows along customizable SVG paths
 * (line, wave, arch, circle). Supports interactive scrubbing, drag fling, ribbon backgrounds, and responsive sizing.
 */
export const TextLoop: React.FC<TextLoopProps> = (props) => {
  return <CurvedLoop {...props} />;
};

export default TextLoop;
