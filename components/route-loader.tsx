'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AbstractCubeIsometricLoader } from '@/components/ui/abstract-cube-isometric-loader';

/** Keeps the loader on screen long enough to read, even on instant routes. */
const MIN_VISIBLE_MS = 100;
const FADE_MS = 250;
/** Never trap the page behind the overlay if a navigation stalls. */
const SAFETY_MS = 8000;

type Phase = 'loading' | 'leaving' | 'idle';

/**
 * Full-screen loader shown while the site boots and whenever a link moves the
 * visitor to another page. It listens for anchor clicks instead of hooking the
 * router, so it works for every `<Link>` and plain `<a>` alike, then gets out
 * of the way as soon as the pathname actually changes.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('loading');
  const shownAt = useRef(0);
  const pending = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const finish = useCallback(() => {
    window.clearTimeout(timer.current);

    const elapsed = shownAt.current
      ? performance.now() - shownAt.current
      : MIN_VISIBLE_MS;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    timer.current = window.setTimeout(() => {
      setPhase((current) => (current === 'loading' ? 'leaving' : current));
    }, wait);
  }, []);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    shownAt.current = performance.now();
    setPhase('loading');
  }, []);

  // Leave the overlay in place for the fade, then unmount it entirely so its
  // animation loop stops.
  useEffect(() => {
    if (phase !== 'leaving') return;
    const id = window.setTimeout(() => setPhase('idle'), FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Hydration means the page is interactive; don't wait for every image or
  // video on the page before revealing the content.
  useEffect(() => {
    shownAt.current = performance.now();
    finish();
    return () => window.clearTimeout(timer.current);
  }, [finish]);

  // Any same-origin link to a different path starts a navigation.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const element = event.target as Element | null;
      const anchor = element?.closest?.(
        'a[href]',
      ) as HTMLAnchorElement | null;

      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.getAttribute('aria-disabled') === 'true') return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page — an in-page chapter jump, which scrolls instead of routing.
      if (url.pathname === window.location.pathname) return;

      pending.current = true;
      show();

      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        pending.current = false;
        finish();
      }, SAFETY_MS);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [finish, show]);

  // The route has arrived.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    finish();
  }, [pathname, finish]);

  if (phase === 'idle') return null;

  const loading = phase === 'loading';

  return (
    <div
      data-route-loader=""
      aria-hidden={!loading}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-ink transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        loading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: loading ? 'auto' : 'none' }}
    >
      <span role="status" aria-live="polite" className="flex flex-col items-center gap-7">
        <span aria-hidden="true" className="text-accent">
          <AbstractCubeIsometricLoader
            dotSize={6}
            gap={4}
            speed={1.1}
            bloom
          />
        </span>
        <span className="font-mono text-[9px] tracking-[0.28em] text-paper/45 uppercase">
          Loading
        </span>
      </span>
    </div>
  );
}
