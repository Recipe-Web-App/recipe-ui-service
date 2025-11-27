'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { TrendingUp, Star, Users, Filter, Copy } from 'lucide-react';

export default function PopularMealPlansPage() {
  return (
    <ComingSoonPage
      title="Popular Meal Plans"
      description="Discover meal plans loved by the community. Find inspiration from highly-rated plans with proven recipes and balanced nutrition."
      icon={TrendingUp}
      section="Meal Plans"
      backHref="/meal-plans"
      backLabel="Browse Meal Plans"
      features={[
        {
          title: 'Top rated',
          description: 'Plans with best ratings',
          icon: Star,
        },
        {
          title: 'Most cloned',
          description: 'Community favorites',
          icon: Users,
        },
        {
          title: 'Clone to calendar',
          description: 'Use popular plans',
          icon: Copy,
        },
        {
          title: 'Filter by duration',
          description: 'Week or month plans',
          icon: Filter,
        },
        {
          title: 'Popularity metrics',
          description: 'Clones and favorites',
          icon: TrendingUp,
        },
      ]}
    />
  );
}
