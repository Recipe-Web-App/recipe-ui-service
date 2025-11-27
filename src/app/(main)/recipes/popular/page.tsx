'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { TrendingUp, Star, Users, Filter, Grid } from 'lucide-react';

export default function PopularRecipesPage() {
  return (
    <ComingSoonPage
      title="Popular Recipes"
      description="Discover what everyone is cooking! Browse recipes with the highest ratings, most favorites, and most views from our community."
      icon={TrendingUp}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse All Recipes"
      features={[
        {
          title: 'Top rated',
          description: 'Recipes with the best ratings',
          icon: Star,
        },
        {
          title: 'Most favorited',
          description: 'Community favorites',
          icon: Users,
        },
        {
          title: 'Popularity metrics',
          description: 'Views, shares, and engagement',
          icon: TrendingUp,
        },
        {
          title: 'Filter by category',
          description: 'Find popular recipes by type',
          icon: Filter,
        },
        {
          title: 'Multiple views',
          description: 'Grid or list layout options',
          icon: Grid,
        },
      ]}
    />
  );
}
