import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  // Notes is still a placeholder; legacy /work pages contain sample projects.
  return ['', '/philosophy', '/thoughts', '/shots', '/space'].map((path) => ({ url: `${siteUrl}${path || '/'}` }));
}
