'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import { FolderHeart, Grid, Edit, Share2, Trash2 } from 'lucide-react';

export default function MyCollectionsPage() {
  return (
    <ComingSoonPage
      title="My Collections"
      description="View and manage all the recipe collections you have created. Organize your recipes by theme, cuisine, occasion, or any way you like."
      icon={FolderHeart}
      section="Collections"
      backHref="/home"
      backLabel="Go Home"
      features={[
        {
          title: 'Grid & list views',
          description: 'Browse collections your way',
          icon: Grid,
        },
        {
          title: 'Quick edit',
          description: 'Add or remove recipes easily',
          icon: Edit,
        },
        {
          title: 'Share collections',
          description: 'Share with friends and family',
          icon: Share2,
        },
        {
          title: 'Manage collections',
          description: 'Edit, duplicate, or delete',
          icon: Trash2,
        },
      ]}
    />
  );
}
