'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Flame, Clock, TrendingUp, Sparkles, Filter } from 'lucide-react';

export default function TrendingCollectionsPage() {
  return (
    <ComingSoonPage
      title="Trending Collections"
      description="Collections gaining momentum right now. Discover curated recipe sets that are surging in popularity with recent engagement."
      icon={Flame}
      section="Collections"
      backHref="/collections"
      backLabel="Browse Collections"
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
          title: 'Rising collections',
          description: 'New collections gaining traction',
          icon: Sparkles,
        },
        {
          title: 'Trend indicators',
          description: 'See engagement velocity',
          icon: TrendingUp,
        },
        {
          title: 'Theme trends',
          description: 'Popular collection themes',
          icon: Filter,
        },
      ]}
    />
  );
}
