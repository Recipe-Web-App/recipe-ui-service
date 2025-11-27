import type { Metadata } from 'next';
import { SectionHubPage } from '@/components/layout/section-hub-page';

export function generateMetadata(): Metadata {
  return {
    title: 'Meal Plans | Recipe App',
    description: 'Plan your meals and stay organized.',
  };
}

/**
 * Meal Plans Hub Page
 *
 * Landing page for the Meal Plans section. Displays a card grid
 * of sub-page navigation options for meal planning.
 */
export default function MealPlansPage() {
  return (
    <SectionHubPage
      sectionId="meal-plans"
      title="Meal Plans"
      description="Plan your meals and stay organized"
    />
  );
}
