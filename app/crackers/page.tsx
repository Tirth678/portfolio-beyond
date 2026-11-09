import type { Metadata } from 'next';
import { CrackerStudio } from '@/components/crackers/cracker-studio';

export const metadata: Metadata = {
  title: 'Diwali Crackers',
  description:
    'A hand-tracked Diwali cracker show. Pinch to pick a cracker, double-pinch to fire it on your camera.',
};

export default function CrackersPage() {
  return <CrackerStudio />;
}
