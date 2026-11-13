'use client';

import { useEffect, useRef, useState } from 'react';
import { FacetBloomLoader } from '@/components/ui/facet-bloom-loader';

/** Decorative, local indicator: it never blocks the surrounding page. */
export function AssetLoader({ loading }: { loading: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !loading) return;
    if (!('IntersectionObserver' in window)) { setNearViewport(true); return; }
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: '150px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading]);

  if (!loading) return null;
  return (
    <div ref={ref} data-asset-loader aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink/20 text-accent/80">
      {nearViewport && <FacetBloomLoader showLabel={false} label="Loading media" size={36} aria-live="off" />}
    </div>
  );
}
