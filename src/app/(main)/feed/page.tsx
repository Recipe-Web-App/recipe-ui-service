import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export function generateMetadata(): Metadata {
  return {
    title: 'Kitchen Feed | Recipe App',
    description: 'See what your co-chefs are cooking.',
  };
}

export default function FeedIndexPage() {
  redirect('/feed/co-chefs');
}
