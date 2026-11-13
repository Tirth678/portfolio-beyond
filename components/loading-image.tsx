'use client';

import Image from 'next/image';
import { useState, type ComponentProps } from 'react';
import { AssetLoader } from '@/components/asset-loader';

/** Next Image with a non-blocking indicator, including a graceful error exit. */
export function LoadingImage({ src, onLoad, onError, ...props }: ComponentProps<typeof Image>) {
  const [loadedSrc, setLoadedSrc] = useState<typeof src | null>(null);
  const loading = loadedSrc !== src;
  return <>
    <Image {...props} src={src} onLoad={(event) => { setLoadedSrc(src); onLoad?.(event); }} onError={(event) => { setLoadedSrc(src); onError?.(event); }} />
    <AssetLoader loading={loading} />
  </>;
}
