import * as cheerio from 'cheerio';

const USERNAME = 'Tirth678';
export type Contribution = { date: string; count: number };
export type GithubActivity = { contributions: Contribution[]; summary: string | null };

/** Read the exact public counts from GitHub's contribution calendar tooltips. */
export function parseContributions(html: string): GithubActivity {
  const $ = cheerio.load(html);
  const contributions: Contribution[] = [];
  let invalid = false;
  $('td.ContributionCalendar-day[data-date][data-level]').each((_, cell) => {
    const element = $(cell);
    const date = element.attr('data-date') ?? '';
    const id = element.attr('id');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !id || !/^[\w-]+$/.test(id)) { invalid = true; return; }
    const label = $(`tool-tip[for="${id}"]`).text().trim();
    const count = /^No contributions?\b/i.test(label) ? 0 : /^(\d[\d,]*) contributions?\b/i.exec(label)?.[1];
    if (count === undefined) { invalid = true; return; }
    const n = typeof count === 'number' ? count : Number(count.replace(/,/g, ''));
    if (!Number.isSafeInteger(n) || n < 0) { invalid = true; return; }
    contributions.push({ date, count: n });
  });
  contributions.sort((a, b) => a.date.localeCompare(b.date));
  if (invalid || contributions.length < 365 || contributions.some((day, i) => i > 0 && Date.parse(`${day.date}T00:00:00Z`) - Date.parse(`${contributions[i - 1].date}T00:00:00Z`) !== 86400000)) {
    throw new Error('GitHub contribution counts are incomplete or unavailable');
  }
  const summary = $('#js-contribution-activity-description').text().replace(/\s+/g, ' ').trim() || null;
  return { contributions, summary };
}

export async function getGithubActivity(): Promise<GithubActivity> {
  try {
    const response = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: { 'User-Agent': 'portfolio-beyond', 'Accept-Language': 'en-US,en;q=0.9' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`GitHub graph: ${response.status}`);
    return parseContributions(await response.text());
  } catch (error) {
    console.error('GitHub activity unavailable:', error);
    return { contributions: [], summary: null };
  }
}
