export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee overflow-hidden border-y border-white/10 bg-ink-soft py-5">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span key={`${group}-${item}`} className="flex items-center">
                <span className="font-mono text-[10px] tracking-[0.28em] whitespace-nowrap text-paper/50 uppercase">
                  {item}
                </span>
                <span className="mx-6 text-[9px] text-accent/80 sm:mx-9" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
