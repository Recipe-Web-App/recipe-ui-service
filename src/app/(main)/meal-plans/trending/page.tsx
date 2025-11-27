'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Flame, Clock, TrendingUp, Sparkles, Copy } from 'lucide-react';

export default function TrendingMealPlansPage() {
  return (
    <ComingSoonPage
      title="Trending Meal Plans"
      description="Meal plans gaining momentum right now. Discover plans that are surging in popularity with recent clones and favorites."
      icon={Flame}
      section="Meal Plans"
      backHref="/meal-plans"
      backLabel="Browse Meal Plans"
      features={[
        {
          title: 'Real-time trends',
          description: 'Updated with latest activity',
          icon: Flame,
        },
        {
          title: 'Time filters',
          description: 'Trending this week or month',
          icon: Clock,
        },
        {
          title: 'Rising plans',
          description: 'New plans gaining traction',
          icon: Sparkles,
        },
        {
          title: 'Trend indicators',
          description: 'See engagement velocity',
          icon: TrendingUp,
        },
        {
          title: 'Clone trending',
          description: 'Try popular plans',
          icon: Copy,
        },
      ]}
    />
  );
}
