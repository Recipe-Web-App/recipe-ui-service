'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  Compass,
  UserPlus,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
} from 'lucide-react';

export default function DiscoverChefsPage() {
  return (
    <ComingSoonPage
      title="Suggested Cooks to Follow"
      description="Discover talented chefs who match your culinary interests. Get personalized recommendations based on your favorites and preferences."
      icon={Compass}
      section="Kitchen Feed"
      backHref="/feed"
      backLabel="Kitchen Feed"
      features={[
        {
          title: 'Personalized picks',
          description: 'Based on your favorites',
          icon: Sparkles,
        },
        {
          title: 'Trending chefs',
          description: 'Popular in the community',
          icon: TrendingUp,
        },
        {
          title: 'Quick follow',
          description: 'One-click follow button',
          icon: UserPlus,
        },
        {
          title: 'Local chefs',
          description: 'Discover nearby cooks',
          icon: Globe,
        },
        {
          title: 'Top rated',
          description: 'Chefs with best recipes',
          icon: Star,
        },
      ]}
    />
  );
}
