import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';
import type { Profile } from '@/lib/types';

const chapters = [
  { label: 'Notes', href: '/notes' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Thoughts', href: '/thoughts' },
  { label: 'Shots', href: '/shots' },
  { label: 'Eternity', href: '/space' },
];

export function SiteFooter({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  const elsewhere = profile.socials.filter(
    (social) => !social.href.startsWith('mailto:'),
  );

  return (
    <HalftoneWordmarkFooter
      wordmark="tirth"
      label={profile.name}
      meta={`© ${year} · ${profile.location}`}
      columns={[
        { title: 'Chapters', links: chapters },
        {
          title: 'Elsewhere',
          links: elsewhere.map((social) => ({
            label: social.label,
            href: social.href,
          })),
        },
        {
          title: 'Contact',
          links: [
            { label: profile.email, href: `mailto:${profile.email}` },
            { label: 'Start a project', href: '/#contact' },
          ],
        },
      ]}
      preset="night"
      palette={{
        background: '#0a0a0a',
        ink: '#f5f2ea',
        warm: '#d4af37',
      }}
      height="clamp(440px, 55vw, 560px)"
      dotGap={6}
      radius={80}
      crop={0.2}
      grain={0.5}
      fontFamily={'"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif'}
      fontWeight={800}
      monoFamily={'"JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, monospace'}
    />
  );
}
