import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Sous Chef | Recipe App',
    description: 'Your AI-powered cooking assistant.',
  };
}

/**
 * Sous Chef Hub Page
 *
 * Landing page for the Sous Chef section. Displays a card grid
 * of sub-page navigation options for cooking assistant tools.
 */
export default function SousChefPage() {
  return (
    <SectionHubPage
      sectionId="sous-chef"
      title="Sous Chef"
      description="Your AI-powered cooking assistant"
    />
  );
}
