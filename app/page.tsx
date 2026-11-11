import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';
import { HeroSlider } from '@/components/hero-slider';
import { Marquee } from '@/components/marquee';
import { ProcessSection } from '@/components/process-section';
import { ShotsSection } from '@/components/shots-section';
import { WorkSection } from '@/components/work-section';
import { getPortfolio } from '@/lib/data';
import { getGithubActivity } from '@/lib/github';
import { GithubSection } from '@/components/github-section';
import { siteUrl } from '@/lib/seo';

export const revalidate = 300;

export default async function HomePage() {
  const { profile, slides, about, process, contact } = await getPortfolio();
  const github = await getGithubActivity();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
        url: siteUrl, jobTitle: 'Developer and creative technologist',
        sameAs: profile.socials.flatMap((social) => social.href?.startsWith('https://') ? [social.href] : []),
      }).replace(/</g, '\u003c') }} />
      <h1 className="sr-only">Tirth S Pandya — Portfolio Beyond Engineering</h1>
      <HeroSlider slides={slides} tagline={profile.tagline} />
      <Marquee items={about.capabilities} />
      <WorkSection slides={slides} />
      <AboutSection about={about} />
      <ProcessSection steps={process} />
      <ShotsSection />
      <ContactSection contact={contact} profile={profile} />
      <GithubSection activity={github} />
    </main>
  );
}
