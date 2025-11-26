'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { TrendingUp, Star, Users, Filter, Grid } from 'lucide-react';

export default function PopularCollectionsPage() {
  return (
    <ComingSoonPage
      title="Popular Collections"
      description="Discover curated collections that the community loves. Find inspiration from highly-rated collections with the most favorites and views."
      icon={TrendingUp}
      section="Collections"
      backHref="/collections"
      backLabel="Browse Collections"
      features={[
        {
          title: 'Top rated',
          description: 'Collections with best ratings',
          icon: Star,
        },
        {
          title: 'Most favorited',
          description: 'Community-loved collections',
          icon: Users,
        },
        {
          title: 'Engagement metrics',
          description: 'Views, favorites, and clones',
          icon: TrendingUp,
        },
        {
          title: 'Filter by theme',
          description: 'Find by category or cuisine',
          icon: Filter,
        },
        {
          title: 'Visual browsing',
          description: 'Grid layout with previews',
          icon: Grid,
        },
      ]}
    />
  );
}
