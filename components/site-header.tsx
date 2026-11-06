'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/types';

const links = [
  { label: 'Notes', href: '/#notes' },
  { label: 'Philosophy', href: '/#philosophy' },
  { label: 'Thoughts', href: '/#thoughts' },
  { label: 'Shots', href: '/#shots' },
  { label: 'Space', href: '/space' },
];

export function SiteHeader({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-black/55 to-transparent'
        }`}
      >
        <div className="shell flex h-[76px] items-center justify-between gap-6">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-[11px] tracking-[0.18em] whitespace-nowrap text-paper uppercase"
          >
            {profile.name}
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative font-mono text-[10px] tracking-[0.2em] text-paper/65 uppercase transition-colors hover:text-paper"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <p className="hidden items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] text-paper/55 uppercase lg:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </p>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="font-mono text-[10px] tracking-[0.2em] text-paper/70 uppercase transition-colors hover:text-paper md:hidden"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[76px] bottom-0 z-40 flex flex-col bg-ink/95 backdrop-blur-xl md:hidden"
        >
          <nav
            aria-label="Sections"
            className="shell flex flex-1 flex-col justify-center"
          >
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-4 border-b border-white/10 py-4 first:border-t"
              >
                <span className="font-mono text-[9px] tracking-[0.2em] text-accent/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-4xl tracking-[-0.02em] text-paper/85 transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto font-mono text-xs text-paper/30"
                >
                  ↗
                </span>
              </Link>
            ))}
          </nav>

          <div className="shell pb-10">
            <p className="font-mono text-[9px] tracking-[0.18em] text-paper/40 uppercase">
              {profile.availability}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-2 inline-block font-mono text-[10px] tracking-[0.18em] text-accent uppercase"
            >
              {profile.email}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
