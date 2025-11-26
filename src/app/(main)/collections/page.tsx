import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Collections | Recipe App',
    description: 'Browse and manage your recipe collections.',
  };
}

/**
 * Collections Hub Page
 *
 * Landing page for the Collections section. Displays a card grid
 * of sub-page navigation options for managing recipe collections.
 */
export default function CollectionsPage() {
  return (
    <SectionHubPage
      sectionId="collections"
      title="Collections"
      description="Curated recipe collections for every occasion"
    />
  );
}
