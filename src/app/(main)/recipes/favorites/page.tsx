'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Heart, Grid, Filter, FolderHeart, Share2 } from 'lucide-react';

export default function FavoriteRecipesPage() {
  return (
    <ComingSoonPage
      title="Favorite Recipes"
      description="Quick access to all the recipes you have loved. Save your favorites for easy reference when planning meals."
      icon={Heart}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse All Recipes"
      features={[
        {
          title: 'Quick access',
          description: 'Find your favorites instantly',
          icon: Heart,
        },
        {
          title: 'Organize favorites',
          description: 'Create collections from favorites',
          icon: FolderHeart,
        },
        {
          title: 'Filter & sort',
          description: 'Filter by category or cuisine',
          icon: Filter,
        },
        {
          title: 'Grid & list views',
          description: 'Choose your preferred layout',
          icon: Grid,
        },
        {
          title: 'Share favorites',
          description: 'Share your top picks with friends',
          icon: Share2,
        },
      ]}
    />
  );
}
