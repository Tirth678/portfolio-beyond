'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SpaceRow } from '@/lib/types';

const isRemote = (src: string) => /^https?:\/\//.test(src);

function Row({
  row,
  mirrored,
  open,
  onToggle,
}: {
  row: SpaceRow;
  mirrored: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `${row.id}-panel`;
  const titleId = `${row.id}-title`;
  const number = row.eyebrow.slice(0, 2);

  return (
    <section
      aria-labelledby={titleId}
      className="border-t border-white/10 py-14 md:py-20"
    >
      <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-8">
        <div
          data-reveal
          className={`md:col-span-6 md:row-start-1 ${
            mirrored
              ? 'md:order-2 md:col-start-7'
              : 'md:order-1 md:col-start-1'
          }`}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Close' : 'Read'} ${row.title}`}
            className="group block w-full text-left"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
              {row.video ? (
                <video
                  src={row.video}
                  aria-label={row.imageAlt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] ${
                    open ? 'scale-[1.03]' : 'group-hover:scale-[1.03]'
                  }`}
                />
              ) : (
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isRemote(row.image)}
                  className={`object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] ${
                    open ? 'scale-[1.03]' : 'group-hover:scale-[1.03]'
                  }`}
                />
              )}
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent transition-opacity duration-500 ${
                  open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              />
              <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">
                {number}
              </span>
              <span className="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.18em] text-white/85 uppercase">
                {open ? 'Close −' : 'Read +'}
              </span>
            </div>

            <span className="mt-4 flex items-baseline justify-between gap-6 font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
              <span>{row.caption}</span>
              <span
                aria-hidden="true"
                className={`transition-transform duration-500 ${
                  open ? 'rotate-45' : 'group-hover:translate-x-1'
                }`}
              >
                →
              </span>
            </span>
          </button>
        </div>

        <div
          data-reveal
          className={`md:col-span-5 md:row-start-1 ${
            mirrored
              ? 'md:order-1 md:col-start-1'
              : 'md:order-2 md:col-start-8'
          }`}
        >
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
            {row.eyebrow}
          </p>

          <h2 id={titleId} className="mt-4">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={panelId}
              className="group flex items-start gap-4 text-left font-display text-[clamp(2.1rem,4vw,3.6rem)] leading-[0.98] tracking-[-0.02em] transition-colors duration-300 hover:text-accent"
            >
              <span>{row.title}</span>
              <span
                aria-hidden="true"
                className={`mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 font-mono text-sm text-paper/60 transition-all duration-500 group-hover:border-accent group-hover:text-accent ${
                  open ? 'rotate-45 border-accent text-accent' : ''
                }`}
              >
                +
              </span>
            </button>
          </h2>

          <p className="mt-5 max-w-[46ch] text-[15px] leading-8 text-paper/65">
            {row.summary}
          </p>

          <div
            id={panelId}
            aria-labelledby={titleId}
            className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
            style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden" aria-hidden={!open}>
              <div
                className={`space-y-4 pt-4 text-[15px] leading-8 text-paper/65 transition-opacity duration-500 ${
                  open ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {row.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="max-w-[46ch]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-5">
                {row.meta.map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-paper/70">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SpaceRows({ rows }: { rows: SpaceRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="shell mt-14 md:mt-20">
      {rows.map((row, index) => (
        <Row
          key={row.id}
          row={row}
          mirrored={index % 2 === 1}
          open={openId === row.id}
          onToggle={() =>
            setOpenId((current) => (current === row.id ? null : row.id))
          }
        />
      ))}
    </div>
  );
}
