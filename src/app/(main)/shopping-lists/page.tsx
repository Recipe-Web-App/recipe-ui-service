import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Shopping Lists | Recipe App',
    description: 'Manage your shopping lists.',
  };
}

/**
 * Shopping Lists Hub Page
 *
 * Landing page for the Shopping Lists section. Displays a card grid
 * of sub-page navigation options for managing shopping lists.
 */
export default function ShoppingListsPage() {
  return (
    <SectionHubPage
      sectionId="shopping-lists"
      title="Shopping Lists"
      description="Manage your shopping lists"
    />
  );
}
