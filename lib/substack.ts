import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { decode } from 'html-entities';

export const SUBSTACK_URL = 'https://tirth819319.substack.com';
const FEED_URL = `${SUBSTACK_URL}/feed`;

export type SubstackPost = {
  title: string;
  url: string;
  excerpt: string;
  date: string | null;
};

function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Parse only the public metadata needed for the index; never render feed HTML. */
export function parseSubstackFeed(xml: string): SubstackPost[] {
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid Substack feed');
  const parsed = new XMLParser({ parseTagValue: false }).parse(xml);
  if (!parsed?.rss?.channel) throw new Error('Unexpected Substack feed');
  const items = parsed.rss.channel.item;
  if (!items) return [];
  return (Array.isArray(items) ? items : [items]).flatMap((item): SubstackPost[] => {
    const title = plainText(item.title);
    const link = typeof item.link === 'string' ? item.link.trim() : '';
    let url: URL;
    try { url = new URL(link); } catch { return []; }
    if (!title || url.protocol !== 'https:' || url.hostname !== 'tirth819319.substack.com' || !url.pathname.startsWith('/p/')) return [];
    const published = new Date(item.pubDate || '');
    const text = plainText(item.description);
    const excerpt = text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text;
    return [{ title, url: url.toString(), excerpt, date: Number.isNaN(published.getTime()) ? null : published.toISOString() }];
  });
}

export async function getSubstackPosts(): Promise<{ posts: SubstackPost[]; unavailable: boolean }> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    return { posts: parseSubstackFeed(await response.text()), unavailable: false };
  } catch (error) {
    console.error('Unable to load Substack feed:', error);
    return { posts: [], unavailable: true };
  }
}
