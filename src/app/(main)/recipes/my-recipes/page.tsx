'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { BookOpen, Filter, Grid, Edit, Trash2, Share2 } from 'lucide-react';

export default function MyRecipesPage() {
  return (
    <ComingSoonPage
      title="My Recipes"
      description="View, edit, and manage all the recipes you have created. Track your drafts and published recipes in one place."
      icon={BookOpen}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse All Recipes"
      features={[
        {
          title: 'Grid & list views',
          description: 'Switch between viewing modes',
          icon: Grid,
        },
        {
          title: 'Advanced filters',
          description: 'Filter by category, tags, and status',
          icon: Filter,
        },
        {
          title: 'Quick edit',
          description: 'Edit your recipes inline',
          icon: Edit,
        },
        {
          title: 'Bulk actions',
          description: 'Delete or archive multiple recipes',
          icon: Trash2,
        },
        {
          title: 'Share recipes',
          description: 'Share your creations with friends',
          icon: Share2,
        },
      ]}
    />
  );
}
