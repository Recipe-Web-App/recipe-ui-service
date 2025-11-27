'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  CalendarPlus,
  CalendarDays,
  GripVertical,
  ShoppingCart,
  Copy,
  BarChart3,
} from 'lucide-react';

export default function CreateMealPlanPage() {
  return (
    <ComingSoonPage
      title="Create Meal Plan"
      description="Plan your meals for the week or month with our interactive calendar. Drag and drop recipes into meal slots and automatically generate shopping lists."
      icon={CalendarPlus}
      section="Meal Plans"
      backHref="/meal-plans"
      backLabel="Browse Meal Plans"
      features={[
        {
          title: 'Calendar interface',
          description: 'Week or month view planning',
          icon: CalendarDays,
        },
        {
          title: 'Drag & drop',
          description: 'Easily assign recipes to meals',
          icon: GripVertical,
        },
        {
          title: 'Auto shopping list',
          description: 'Generate lists from your plan',
          icon: ShoppingCart,
        },
        {
          title: 'Templates',
          description: 'Save and reuse meal plans',
          icon: Copy,
        },
        {
          title: 'Nutrition tracking',
          description: 'See daily nutritional summary',
          icon: BarChart3,
        },
      ]}
    />
  );
}
