import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { decode } from 'html-entities';

export const SUBSTACK_URL = 'https://tirth819319.substack.com';
const FEED_URL = `${SUBSTACK_URL}/feed`;

export type SubstackPost = {
  title: string;
  url: string;
  preview: string[];
  date: string | null;
};

function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// Feed content can contain full public articles. Show only a short opening,
// as plain text; keep paragraph breaks but never inject Substack's HTML.
function articlePreview(content: unknown, description: unknown): string[] {
  const source = typeof content === 'string' && content.trim() ? content : description;
  if (typeof source !== 'string') return [];
  const text = source
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(?:p|div|h[1-6]|li|blockquote)>/gi, '\n\n')
    .replace(/<[^>]*>/g, ' ');
  const paragraphs = decode(text).split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const result: string[] = [];
  let remaining = 650;
  for (const paragraph of paragraphs.slice(0, 3)) {
    if (remaining <= 0) break;
    if (paragraph.length > remaining) {
      const truncated = paragraph.slice(0, Math.max(0, remaining - 1));
      const lastSpace = truncated.lastIndexOf(' ');
      result.push(`${(lastSpace > remaining / 2 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}…`);
      break;
    }
    result.push(paragraph);
    remaining -= paragraph.length;
  }
  return result;
}

/** Parse public feed text only; never render feed HTML. */
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
    const preview = articlePreview(item['content:encoded'], item.description);
    return [{ title, url: url.toString(), preview, date: Number.isNaN(published.getTime()) ? null : published.toISOString() }];
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
