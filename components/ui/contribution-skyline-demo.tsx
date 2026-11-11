import ContributionSkyline from '@/components/ui/contribution-skyline';
import { getGithubActivity } from '@/lib/github';

/** Example using the same public data and palette as the portfolio. */
export default async function ContributionSkylineDemo() {
  const { contributions, summary } = await getGithubActivity();
  if (!contributions.length) return <p>GitHub activity is temporarily unavailable.</p>;
  return (
    <div className="w-full [--color-background:#111110] [--color-foreground:#f5f2ea] [--color-border:rgba(245,242,234,0.14)] [--color-muted-foreground:rgba(245,242,234,0.55)]">
      <ContributionSkyline data={contributions} title={summary ?? undefined} palette={['#554718', '#8b7224', '#ba9830', '#e0c366']} />
    </div>
  );
}
