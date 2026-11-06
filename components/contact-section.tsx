import type { Contact, Profile } from '@/lib/types';

export function ContactSection({
  contact,
  profile,
}: {
  contact: Contact;
  profile: Profile;
}) {
  return (
    <section id="contact" className="section border-t border-white/10 bg-[#0d0d0c]">
      <div className="shell">
        <p className="section-label" data-reveal>
          06 — Contact
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-reveal>
            <h2 className="font-display text-[clamp(2.7rem,6.4vw,5.8rem)] leading-[0.94] tracking-[-0.03em]">
              {contact.heading}
            </h2>

            <a
              href={`mailto:${profile.email}`}
              className="group mt-10 inline-flex items-center gap-4 border-b border-accent/40 pb-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase transition-colors hover:border-accent"
            >
              {profile.email}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          </div>

          <div className="md:col-span-4 md:col-start-9" data-reveal>
            <p className="text-sm leading-7 text-paper/55">{contact.note}</p>

            <div className="mt-8">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="group flex items-center justify-between border-b border-white/10 py-3 font-mono text-[10px] tracking-[0.18em] text-paper/55 uppercase transition-colors hover:text-accent"
                >
                  {social.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-8 font-mono text-[9px] tracking-[0.18em] text-paper/35 uppercase">
              {profile.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
