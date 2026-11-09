import * as cheerio from 'cheerio';
import { siC, siCplusplus, siCss, siHtml5, siJavascript, siJupyter, siPython, siRust, siTypescript } from 'simple-icons';

const USERNAME = 'Tirth678';
const iconByLanguage: Record<string, { path: string }> = {
  TypeScript: siTypescript, JavaScript: siJavascript, Python: siPython,
  C: siC, 'C++': siCplusplus, HTML: siHtml5, CSS: siCss,
  Rust: siRust, 'Jupyter Notebook': siJupyter,
};

export type Contribution = { date: string; level: number; label: string };
export type GithubActivity = {
  contributions: Contribution[];
  summary: string | null;
  languages: { name: string; image: string }[];
};

export function parseContributions(html: string): Pick<GithubActivity, 'contributions' | 'summary'> {
  const $ = cheerio.load(html);
  const contributions: Contribution[] = [];
  $('td.ContributionCalendar-day[data-date][data-level]').each((_, cell) => {
    const element = $(cell);
    const date = element.attr('data-date') ?? '';
    const level = Number(element.attr('data-level'));
    const id = element.attr('id');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(level) || level < 0 || level > 4 || !id) return;
    const label = $(`tool-tip[for="${id}"]`).text().trim();
    contributions.push({ date, level, label: label || `Contribution activity on ${date}` });
  });
  const summary = $('#js-contribution-activity-description').text().replace(/\s+/g, ' ').trim() || null;
  if (!contributions.length) throw new Error('GitHub contribution graph unavailable');
  return { contributions, summary };
}

export async function getGithubActivity(): Promise<GithubActivity> {
  const headers = { 'User-Agent': 'portfolio-beyond', Accept: 'application/vnd.github+json' };
  const [graph, repos] = await Promise.allSettled([
    fetch(`https://github.com/users/${USERNAME}/contributions`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(async response => {
      if (!response.ok) throw new Error(`GitHub graph: ${response.status}`);
      return parseContributions(await response.text());
    }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(async response => {
      if (!response.ok) throw new Error(`GitHub repositories: ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected GitHub repositories response');
      const counts = new Map<string, number>();
      for (const repo of data) {
        if (!repo.fork && typeof repo.language === 'string' && iconByLanguage[repo.language]) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
      }
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name]) => {
        const icon = iconByLanguage[name];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f5f2ea" d="${icon.path}"/></svg>`;
        return { name, image: `data:image/svg+xml,${encodeURIComponent(svg)}` };
      });
    }),
  ]);
  if (graph.status === 'rejected') console.error('GitHub activity unavailable:', graph.reason);
  if (repos.status === 'rejected') console.error('GitHub languages unavailable:', repos.reason);
  return {
    contributions: graph.status === 'fulfilled' ? graph.value.contributions : [],
    summary: graph.status === 'fulfilled' ? graph.value.summary : null,
    languages: repos.status === 'fulfilled' ? repos.value : [],
  };
}
