'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  Share2,
  UserPlus,
  Heart,
  FolderPlus,
  MessageSquare,
} from 'lucide-react';

export default function SharedCollectionsPage() {
  return (
    <ComingSoonPage
      title="Shared Collections"
      description="Collections shared with you by friends and fellow chefs. Accept shares to add them to your favorites or clone them as your own."
      icon={Share2}
      section="Collections"
      backHref="/collections"
      backLabel="Browse Collections"
      features={[
        {
          title: 'Shared with you',
          description: 'See who shared each collection',
          icon: UserPlus,
        },
        {
          title: 'Accept shares',
          description: 'Add to your favorites',
          icon: Heart,
        },
        {
          title: 'Clone collections',
          description: 'Make your own copy',
          icon: FolderPlus,
        },
        {
          title: 'Thank the chef',
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
