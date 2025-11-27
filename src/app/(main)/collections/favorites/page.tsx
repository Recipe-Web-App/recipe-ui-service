'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { Heart, Grid, Filter, BookOpen, FolderHeart } from 'lucide-react';

export default function FavoriteCollectionsPage() {
  return (
    <ComingSoonPage
      title="Favorite Collections"
      description="Quick access to collections you have loved. Save curated collections from other chefs for easy reference."
      icon={Heart}
      section="Collections"
      backHref="/collections"
      backLabel="Browse Collections"
      features={[
        {
          title: 'Quick access',
          description: 'Find favorite collections fast',
          icon: Heart,
        },
        {
          title: 'Browse recipes',
          description: 'View recipes in each collection',
          icon: BookOpen,
        },
        {
          title: 'Filter & sort',
          description: 'Organize your favorites',
          icon: Filter,
        },
        {
          title: 'Grid layout',
          description: 'Visual collection browsing',
          icon: Grid,
        },
        {
          title: 'Clone collections',
          description: 'Copy to your own collections',
          icon: FolderHeart,
        },
      ]}
    />
  );
}
