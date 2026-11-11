import { chapterMetadata } from '@/lib/seo';
import { ChapterComingSoon } from '@/components/chapter-coming-soon';

export const metadata = {
  ...chapterMetadata('Notes', 'Notes — coming soon.', '/notes'),
  robots: { index: false, follow: true },
};

export default function NotesPage() {
  return <ChapterComingSoon title="Notes" eyebrow="Observations" number="01" />;
}
