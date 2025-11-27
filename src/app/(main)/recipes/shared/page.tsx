'use client';

import { ComingSoonPage } from '@/components/layout/coming-soon-page';
import {
  Share2,
  UserPlus,
  Heart,
  FolderPlus,
  MessageSquare,
} from 'lucide-react';

export default function SharedRecipesPage() {
  return (
    <ComingSoonPage
      title="Shared Recipes"
      description="Recipes shared with you by friends and fellow chefs. Accept shares to add them to your collection or favorites."
      icon={Share2}
      section="Recipes"
      backHref="/recipes"
      backLabel="Browse All Recipes"
      features={[
        {
          title: 'Shared with you',
          description: 'See who shared each recipe',
          icon: UserPlus,
        },
        {
          title: 'Accept shares',
          description: 'Add to favorites or collections',
          icon: Heart,
        },
        {
          title: 'Organize shares',
          description: 'Sort into your collections',
          icon: FolderPlus,
        },
        {
          title: 'Thank the chef',
          description: 'Send appreciation to sharers',
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
