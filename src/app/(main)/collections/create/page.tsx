'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  FolderPlus,
  Image,
  Search,
  GripVertical,
  Users,
  Eye,
} from 'lucide-react';

export default function CreateCollectionPage() {
  return (
    <ComingSoonPage
      title="Create Collection"
      description="Curate and organize your favorite recipes into themed collections. Perfect for meal planning, special occasions, or sharing with friends."
      icon={FolderPlus}
      section="Collections"
      backHref="/collections"
      backLabel="Browse Collections"
      features={[
        {
          title: 'Visual picker',
          description: 'Search and select recipes to add',
          icon: Search,
        },
        {
          title: 'Cover images',
          description: 'Choose from recipe images or upload custom',
          icon: Image,
        },
        {
          title: 'Drag & drop',
          description: 'Reorder recipes in your collection',
          icon: GripVertical,
        },
        {
          title: 'Collaborate',
          description: 'Invite others to contribute',
          icon: Users,
        },
        {
          title: 'Preview mode',
          description: 'See how it looks before publishing',
          icon: Eye,
        },
      ]}
    />
  );
}
