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
import { ImperialQuote } from '@/components/imperial-quote';
import { getProfile } from '@/lib/data';
import { homeDescription, homeTitle, siteUrl, socialImage } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: '%s — Tirth S Pandya' },
  description: homeDescription,
  alternates: { canonical: '/' },
  robots: process.env.VERCEL_ENV === 'preview' ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: 'website', siteName: 'Tirth S Pandya', title: homeTitle,
    description: homeDescription, url: '/',
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'The Sombrero Galaxy against a star-filled sky' }],
  },
  twitter: { card: 'summary_large_image', title: homeTitle, description: homeDescription, images: [socialImage] },
};

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
          <style>{'[data-route-loader]{display:none}[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <SiteHeader profile={profile} />
        {children}
        <SiteFooter profile={profile} />
        <ImperialQuote />
        <ScrollReveal />
        <RouteLoader />
        <Analytics />
      </body>
    </html>
  );
}
