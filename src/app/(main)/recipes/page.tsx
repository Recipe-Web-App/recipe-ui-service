import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Recipes | Recipe App',
    description: 'Browse and manage your recipe collection.',
  };
}

/**
 * Recipes Hub Page
 *
 * Landing page for the Recipes section. Displays a card grid
 * of sub-page navigation options for managing recipes.
 */
export default function RecipesPage() {
  return (
    <SectionHubPage
      sectionId="recipes"
      title="Recipes"
      description="Browse and manage your recipe collection"
    />
  );
}
