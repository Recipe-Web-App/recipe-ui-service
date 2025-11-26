import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export function generateMetadata(): Metadata {
  return {
    title: 'Sous Chef | Recipe App',
    description: 'Your AI-powered cooking assistant.',
  };
}

export default function SousChefIndexPage() {
  redirect('/sous-chef/timers');
}
