import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { RouteLoader } from '@/components/route-loader';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProfile } from '@/lib/data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteTitle = `${profile.name} — Portfolio Beyond Engineering`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s — ${profile.name}`,
    },
    description: profile.intro,
    keywords: [
      'portfolio',
      'visual designer',
      'creative developer',
      'art direction',
      profile.name,
    ],
    openGraph: {
      type: 'website',
      siteName: profile.name,
      title: siteTitle,
      description: profile.intro,
      images: [
        {
          url: '/images/thoughts.jpg',
          width: 1200,
          height: 675,
          alt: 'A caped figure watching a rain-soaked city at night',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: profile.intro,
      images: ['/images/thoughts.jpg'],
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
    >
      <body id="top" className="bg-ink text-paper antialiased">
        <noscript>
          {/* The loader is dismissed by script; without it, keep the page usable. */}
          <style>{'[data-route-loader]{display:none}'}</style>
        </noscript>
        <SiteHeader profile={profile} />
        {children}
        <SiteFooter profile={profile} />
        <ScrollReveal />
        <RouteLoader />
        <Analytics />
      </body>
    </html>
  );
}
