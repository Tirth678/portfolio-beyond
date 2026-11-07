import type { Metadata } from 'next';
import { ChapterComingSoon } from '@/components/chapter-coming-soon';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Notes — coming soon.',
};

export default function NotesPage() {
  return <ChapterComingSoon title="Notes" eyebrow="Observations" number="01" />;
}
