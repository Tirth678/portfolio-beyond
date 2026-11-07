import type { Metadata } from 'next';
import { ChapterComingSoon } from '@/components/chapter-coming-soon';

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Thoughts — coming soon.',
};

export default function ThoughtsPage() {
  return <ChapterComingSoon title="Thoughts" eyebrow="After dark" number="03" />;
}
