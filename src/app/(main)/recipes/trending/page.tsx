'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Flame, Clock, TrendingUp, Filter, Sparkles } from 'lucide-react';

export default function TrendingRecipesPage() {
  return (
    <ComingSoonPage
      title="Trending Recipes"
      description="See what is hot right now! Discover recipes that are gaining popularity with recent surges in views, favorites, and shares."
      icon={Flame}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse All Recipes"
      features={[
        {
          title: 'Real-time trends',
          description: 'Updated frequently with latest activity',
          icon: Flame,
        },
        {
          title: 'Time filters',
          description: 'Trending this week, month, or quarter',
          icon: Clock,
        },
        {
          title: 'Rising stars',
          description: 'New recipes gaining traction',
          icon: Sparkles,
        },
        {
          title: 'Trend indicators',
          description: 'See engagement velocity',
          icon: TrendingUp,
        },
        {
          title: 'Category trends',
          description: 'What is popular by cuisine type',
          icon: Filter,
        },
      ]}
    />
  );
}
