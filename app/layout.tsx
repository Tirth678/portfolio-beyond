import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { RouteLoader } from '@/components/route-loader';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProfile } from '@/lib/data';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile.name} — Visual Designer & Creative Developer`,
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
      title: `${profile.name} — Visual Designer & Creative Developer`,
      description: profile.intro,
      images: [
        {
          url: '/api/images/portfolio/thoughts.jpg',
          width: 1200,
          height: 675,
          alt: 'A caped figure watching a rain-soaked city at night',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} — Visual Designer & Creative Developer`,
      description: profile.intro,
      images: ['/api/images/portfolio/thoughts.jpg'],
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
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
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
      </body>
    </html>
  );
}
