import LogoCloud from '@/components/ui/logo-cloud';
import { getGithubActivity } from '@/lib/github';

/** Standalone example using the same public GitHub data as the homepage. */
export default async function LogoCloudDemo() {
  const activity = await getGithubActivity();
  return <LogoCloud username="Tirth678" summary={activity.summary} contributions={activity.contributions} brandLogos={activity.languages} />;
}
