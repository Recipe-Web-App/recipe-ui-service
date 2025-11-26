'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Calendar, Grid, Edit, Copy, Trash2 } from 'lucide-react';

export default function MyMealPlansPage() {
  return (
    <ComingSoonPage
      title="My Meal Plans"
      description="View and manage all your meal plans. See current, upcoming, and past plans with quick access to edit or duplicate them."
      icon={Calendar}
      section="Meal Plans"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Current plans',
          description: 'Plans active this week',
          icon: Calendar,
        },
        {
          title: 'Grid & list views',
          description: 'Browse plans your way',
          icon: Grid,
        },
        {
          title: 'Quick edit',
          description: 'Modify plans easily',
          icon: Edit,
        },
        {
          title: 'Duplicate plans',
          description: 'Reuse successful plans',
          icon: Copy,
        },
        {
          title: 'Archive or delete',
          description: 'Clean up old plans',
          icon: Trash2,
        },
      ]}
    />
  );
}
