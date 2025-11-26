'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Heart, Calendar, Copy, Filter, Grid } from 'lucide-react';

export default function FavoriteMealPlansPage() {
  return (
    <ComingSoonPage
      title="Favorite Meal Plans"
      description="Quick access to meal plans you have loved. Clone them to your own calendar or use them as inspiration for new plans."
      icon={Heart}
      section="Meal Plans"
      backHref="/meal-plans"
      backLabel="Browse Meal Plans"
      features={[
        {
          title: 'Quick access',
          description: 'Find favorite plans fast',
          icon: Heart,
        },
        {
          title: 'Clone to calendar',
          description: 'Use plans on your schedule',
          icon: Calendar,
        },
        {
          title: 'Duplicate plans',
          description: 'Make your own copy',
          icon: Copy,
        },
        {
          title: 'Filter & sort',
          description: 'Organize your favorites',
          icon: Filter,
        },
        {
          title: 'Grid layout',
          description: 'Visual plan browsing',
          icon: Grid,
        },
      ]}
    />
  );
}
