'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { CircularGalleryProps, GalleryItem } from './CircularGallery';

export type { CircularGalleryProps, GalleryItem };

const CircularGalleryComponent = dynamic(() => import('./CircularGallery'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-48 w-48 animate-pulse rounded-full border border-neutral-200/60 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/50" />
    </div>
  ),
});

export default function CircularGalleryWrapper(props: CircularGalleryProps) {
  return <CircularGalleryComponent {...props} />;
}

