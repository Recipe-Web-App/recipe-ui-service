'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  ListPlus,
  Calendar,
  BookOpen,
  Layers,
  Store,
  Tags,
} from 'lucide-react';

export default function CreateShoppingListPage() {
  return (
    <ComingSoonPage
      title="Create Shopping List"
      description="Build your shopping list by importing ingredients from recipes or meal plans. Smart aggregation combines duplicate items automatically."
      icon={ListPlus}
      section="Shopping Lists"
      backHref="/shopping-lists"
      backLabel="Browse Lists"
      features={[
        {
          title: 'Import from meal plan',
          description: 'Auto-generate from weekly plan',
          icon: Calendar,
        },
        {
          title: 'Import from recipes',
          description: 'Add ingredients from any recipe',
          icon: BookOpen,
        },
        {
          title: 'Smart aggregation',
          description: 'Combine duplicate ingredients',
          icon: Layers,
        },
        {
          title: 'Category grouping',
          description: 'Organized by store aisle',
          icon: Store,
        },
        {
          title: 'Manual items',
          description: 'Add custom items too',
          icon: Tags,
        },
      ]}
    />
  );
}
