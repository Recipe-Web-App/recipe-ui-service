import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Kitchen Feed | Recipe App',
    description: 'See what your co-chefs are cooking.',
  };
}

/**
 * Kitchen Feed Hub Page
 *
 * Landing page for the Kitchen Feed section. Displays a card grid
 * of sub-page navigation options for social activity features.
 */
export default function FeedPage() {
  return (
    <SectionHubPage
      sectionId="kitchen-feed"
      title="Kitchen Feed"
      description="See what your co-chefs are cooking"
    />
  );
}
