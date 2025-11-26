'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { ChefHat, Image, ListOrdered, Clock, Tags, Eye } from 'lucide-react';

export default function CreateRecipePage() {
  return (
    <ComingSoonPage
      title="Create Recipe"
      description="Build your culinary masterpieces with our intuitive recipe creator. Add ingredients, step-by-step instructions, and beautiful photos."
      icon={ChefHat}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse Recipes"
      features={[
        {
          title: 'Multi-step wizard',
          description: 'Guided recipe creation process',
          icon: ListOrdered,
        },
        {
          title: 'Image upload',
          description: 'Add photos for each step',
          icon: Image,
        },
        {
          title: 'Timing & servings',
          description: 'Set prep time, cook time, and portions',
          icon: Clock,
        },
        {
          title: 'Tags & categories',
          description: 'Organize with cuisine types and dietary tags',
          icon: Tags,
        },
        {
          title: 'Preview mode',
          description: 'See how your recipe will look before publishing',
          icon: Eye,
        },
        {
          title: 'Auto-save drafts',
          description: 'Never lose your work in progress',
          icon: Clock,
        },
      ]}
    />
  );
}
