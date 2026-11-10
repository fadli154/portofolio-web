'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { LanyardProps } from './Lanyard';

const LanyardComponent = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-32 w-24 animate-pulse rounded-2xl border border-neutral-200/60 bg-neutral-100/50 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50" />
    </div>
  ),
});

export default function LanyardWrapper(props: LanyardProps) {
  return <LanyardComponent {...props} />;
}

