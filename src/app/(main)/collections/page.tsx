'use client';

import { SectionHubPage } from '@/components/layout/section-hub-page';
import { CollectionDraftBanner } from '@/components/collection';

/**
 * Collections Hub Page
 *
 * Landing page for the Collections section. Displays a card grid
 * of sub-page navigation options for managing recipe collections.
 * Also shows a draft banner if the user has an unsaved collection draft.
 */
export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <CollectionDraftBanner />
      <SectionHubPage
        sectionId="collections"
        title="Collections"
        description="Curated recipe collections for every occasion"
      />
    </div>
  );
}
