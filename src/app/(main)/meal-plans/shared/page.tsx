'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Share2, UserPlus, Calendar, Copy, MessageSquare } from 'lucide-react';

export default function SharedMealPlansPage() {
  return (
    <ComingSoonPage
      title="Shared Meal Plans"
      description="Meal plans shared with you by friends and family. Clone them to your own calendar or use them as templates for your planning."
      icon={Share2}
      section="Meal Plans"
      backHref="/meal-plans"
      backLabel="Browse Meal Plans"
      features={[
        {
          title: 'Shared with you',
          description: 'See who shared each plan',
          icon: UserPlus,
        },
        {
          title: 'Clone to calendar',
          description: 'Add to your schedule',
          icon: Calendar,
        },
        {
          title: 'Make a copy',
          description: 'Customize shared plans',
          icon: Copy,
        },
        {
          title: 'Thank the planner',
          description: 'Send appreciation',
          icon: MessageSquare,
        },
        {
          title: 'Decline shares',
          description: 'Remove unwanted shares',
          icon: Share2,
        },
      ]}
    />
  );
}
