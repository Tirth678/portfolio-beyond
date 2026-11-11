import type { Metadata } from 'next';

// Explicit site URL takes precedence when a custom domain is configured.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` :
    process.env.NODE_ENV === 'production' ? 'https://portfolio-beyond-sigma.vercel.app' : 'http://localhost:3000')).replace(/\/$/, '');

export const siteName = 'Tirth S Pandya';
export const homeTitle = 'Tirth S Pandya — Portfolio Beyond Engineering';
export const homeDescription = 'Tirth S Pandya is a developer and creative technologist exploring software, AI, photography and ideas.';
export const socialImage = '/images/social-preview.jpg';

export function chapterMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = `${title} — ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName, title: socialTitle, description, url: path, images: [{ url: socialImage, width: 1200, height: 630, alt: 'The Sombrero Galaxy against a star-filled sky' }] },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [socialImage] },
  };
}
